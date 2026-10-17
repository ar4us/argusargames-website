import { supabase, isSupabaseConfigured } from "./supabase";
import type {
  Game,
  GameVersion,
  GameWithLatest,
  LocalizationRequest,
  SiteSettings,
  UpcomingGame,
} from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_name_ar: "ArgusArGames",
  site_name_en: "ArgusArGames",
  social_facebook: null,
  social_twitter: null,
  social_reddit: null,
  social_discord: null,
  social_telegram: null,
  updated_at: new Date(0).toISOString(),
};

export interface GameListParams {
  q?: string;
  sort?: "newest" | "downloads";
  page?: number;
  perPage?: number;
  includeUnpublished?: boolean;
}

export interface GameListResult {
  games: GameWithLatest[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
}

let cachedSettingsPromise: Promise<SiteSettings> | null = null;

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;
  if (!cachedSettingsPromise) {
    cachedSettingsPromise = (async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();
        return (data as SiteSettings) ?? DEFAULT_SETTINGS;
      } catch {
        return DEFAULT_SETTINGS;
      }
    })();
  }
  return cachedSettingsPromise;
}

import fallbackGames from "@/data/fallback_games_with_latest.json";
import fallbackVersions from "@/data/supabase_versions_backup.json";
import fallbackUpcoming from "@/data/supabase_upcoming_backup.json";

export function sanitizeGame<T extends any>(g: T): T {
  if (!g || typeof g !== "object") return g;
  const clone = { ...g } as any;
  if (clone.cover_url && typeof clone.cover_url === "string" && clone.cover_url.startsWith("data:")) {
    clone.cover_url = `/images/covers/${clone.slug}.webp`;
  }
  if (clone.description_en && typeof clone.description_en === "string" && clone.description_en.includes("data:")) {
    try {
      const parsed = JSON.parse(clone.description_en);
      if (Array.isArray(parsed.screenshots)) {
        parsed.screenshots = parsed.screenshots.map((s: string, idx: number) => {
          if (typeof s === "string" && s.startsWith("data:")) {
            return `/images/screenshots/${clone.slug}-${idx + 1}.webp`;
          }
          return s;
        });
        clone.description_en = JSON.stringify(parsed);
      }
    } catch {}
  }
  return clone as T;
}

export function sanitizeGames<T extends any[]>(list: T): T {
  if (!Array.isArray(list)) return list;
  return list.map(sanitizeGame) as T;
}

export async function getGames({
  q = "",
  sort = "newest",
  page = 1,
  perPage = 12,
  includeUnpublished = false,
}: GameListParams): Promise<GameListResult> {
  const getFallbackResult = (): GameListResult => {
    let list = [...(fallbackGames as unknown as GameWithLatest[])];
    if (!includeUnpublished) list = list.filter((g) => g.published !== false);
    const term = q.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (g) =>
          g.title_ar.toLowerCase().includes(term) ||
          g.title_en.toLowerCase().includes(term) ||
          g.slug.toLowerCase().includes(term),
      );
    }
    if (sort === "downloads") {
      list.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    const total = list.length;
    const from = (page - 1) * perPage;
    const paginated = list.slice(from, from + perPage);
    return {
      games: paginated,
      total,
      page,
      perPage,
      pageCount: Math.max(1, Math.ceil(total / perPage)),
    };
  };

  if (!isSupabaseConfigured()) return getFallbackResult();

  try {
    let query = supabase
      .from("games_with_latest")
      .select("*", { count: "exact" });

    if (!includeUnpublished) query = query.eq("published", true);

    const term = q.trim();
    if (term) {
      const safe = term.replace(/[%,()]/g, " ").trim();
      query = query.or(
        `title_ar.ilike.%${safe}%,title_en.ilike.%${safe}%,slug.ilike.%${safe}%`,
      );
    }

    query =
      sort === "downloads"
        ? query.order("download_count", { ascending: false })
        : query.order("created_at", { ascending: false });

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    const { data, count, error } = await query.range(from, to);
    if (error || !data || data.length === 0) {
      return getFallbackResult();
    }

    const total = count ?? data.length;
    return {
      games: sanitizeGames((data as GameWithLatest[]) ?? []),
      total,
      page,
      perPage,
      pageCount: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch {
    return getFallbackResult();
  }
}

export async function getAllPublishedGames(): Promise<GameWithLatest[]> {
  if (!isSupabaseConfigured()) return sanitizeGames(fallbackGames as unknown as GameWithLatest[]);
  try {
    const { data, error } = await supabase
      .from("games_with_latest")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return sanitizeGames(fallbackGames as unknown as GameWithLatest[]);
    }
    return sanitizeGames((data as GameWithLatest[]) ?? []);
  } catch {
    return sanitizeGames(fallbackGames as unknown as GameWithLatest[]);
  }
}

export async function getLatestGames(limit = 8): Promise<GameWithLatest[]> {
  const res = await getGames({ sort: "newest", perPage: limit, page: 1 });
  return res.games;
}

export async function getMostDownloaded(limit = 5): Promise<GameWithLatest[]> {
  const res = await getGames({ sort: "downloads", perPage: limit, page: 1 });
  return res.games;
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const findFallback = () =>
    sanitizeGame((fallbackGames as unknown as Game[]).find((g) => g.slug === slug) || null);

  if (!isSupabaseConfigured()) return findFallback();
  try {
    const { data } = await supabase
      .from("games")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return sanitizeGame((data as Game) ?? findFallback());
  } catch {
    return findFallback();
  }
}

export async function getGameVersions(gameId: string): Promise<GameVersion[]> {
  const getFallbackVersions = () =>
    (fallbackVersions as unknown as GameVersion[]).filter((v) => v.game_id === gameId);

  if (!isSupabaseConfigured()) return getFallbackVersions();
  try {
    const { data } = await supabase
      .from("versions")
      .select("*")
      .eq("game_id", gameId)
      .order("release_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data as GameVersion[];
    return getFallbackVersions();
  } catch {
    return getFallbackVersions();
  }
}

export async function getTopRequests(limit = 20): Promise<LocalizationRequest[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data } = await supabase
      .from("requests")
      .select("*")
      .order("vote_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as LocalizationRequest[]) ?? [];
  } catch {
    return [];
  }
}

export async function getUpcomingGames(): Promise<UpcomingGame[]> {
  const getFallbackUpcoming = () => fallbackUpcoming as unknown as UpcomingGame[];
  if (!isSupabaseConfigured()) return getFallbackUpcoming();
  try {
    const { data, error } = await supabase
      .from("upcoming_games")
      .select("*")
      .order("progress_percentage", { ascending: false })
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return getFallbackUpcoming();
    return (data as UpcomingGame[]) ?? getFallbackUpcoming();
  } catch {
    return getFallbackUpcoming();
  }
}

export interface AdminStats {
  games: number;
  versions: number;
  requests: number;
  downloads: number;
}

export async function getAllGamesForAdmin(): Promise<Game[]> {
  if (!isSupabaseConfigured()) return sanitizeGames(fallbackGames as unknown as Game[]);
  try {
    const { data } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });
    return sanitizeGames((data as Game[]) ?? (fallbackGames as unknown as Game[]));
  } catch {
    return sanitizeGames(fallbackGames as unknown as Game[]);
  }
}

export async function getGameById(id: string): Promise<Game | null> {
  const findFallback = () =>
    sanitizeGame((fallbackGames as unknown as Game[]).find((g) => g.id === id) || null);

  if (!isSupabaseConfigured()) return findFallback();
  try {
    const { data } = await supabase
      .from("games")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return sanitizeGame((data as Game) ?? findFallback());
  } catch {
    return findFallback();
  }
}

export async function getAllRequests(status?: string): Promise<LocalizationRequest[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    let query = supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (status) query = query.eq("status", status);
    const { data } = await query;
    return (data as LocalizationRequest[]) ?? [];
  } catch {
    return [];
  }
}

export async function getUpcomingGameById(id: string): Promise<UpcomingGame | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data } = await supabase
      .from("upcoming_games")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return (data as UpcomingGame) ?? null;
  } catch {
    return null;
  }
}

export async function getStats(): Promise<AdminStats> {
  const fallbackStat: AdminStats = {
    games: (fallbackGames as any[]).length,
    versions: (fallbackVersions as any[]).length,
    requests: 0,
    downloads: (fallbackGames as any[]).reduce(
      (sum, row) => sum + ((row.download_count as number) ?? 0),
      0,
    ),
  };

  if (!isSupabaseConfigured()) return fallbackStat;
  try {
    const [games, versions, requests, downloads] = await Promise.all([
      supabase.from("games").select("*", { count: "exact", head: true }),
      supabase.from("versions").select("*", { count: "exact", head: true }),
      supabase.from("requests").select("*", { count: "exact", head: true }),
      supabase.from("games").select("download_count"),
    ]);
    const downloadTotal = (downloads.data ?? []).reduce(
      (sum, row) => sum + ((row.download_count as number) ?? 0),
      0,
    );
    const gameCount = games.count ?? 0;
    if (gameCount === 0) return fallbackStat;
    return {
      games: gameCount,
      versions: versions.count ?? fallbackStat.versions,
      requests: requests.count ?? 0,
      downloads: downloadTotal || fallbackStat.downloads,
    };
  } catch {
    return fallbackStat;
  }
}
