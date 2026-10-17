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

export async function getGames({
  q = "",
  sort = "newest",
  page = 1,
  perPage = 12,
  includeUnpublished = false,
}: GameListParams): Promise<GameListResult> {
  const empty: GameListResult = {
    games: [],
    total: 0,
    page,
    perPage,
    pageCount: 0,
  };
  if (!isSupabaseConfigured()) return empty;

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
    if (error) throw error;

    const total = count ?? 0;
    return {
      games: (data as GameWithLatest[]) ?? [],
      total,
      page,
      perPage,
      pageCount: Math.max(1, Math.ceil(total / perPage)),
    };
  } catch {
    return empty;
  }
}

export async function getAllPublishedGames(): Promise<GameWithLatest[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data } = await supabase
      .from("games_with_latest")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return (data as GameWithLatest[]) ?? [];
  } catch {
    return [];
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
  if (!isSupabaseConfigured()) return null;
  try {
    const { data } = await supabase
      .from("games")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return (data as Game) ?? null;
  } catch {
    return null;
  }
}

export async function getGameVersions(gameId: string): Promise<GameVersion[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data } = await supabase
      .from("versions")
      .select("*")
      .eq("game_id", gameId)
      .order("release_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    return (data as GameVersion[]) ?? [];
  } catch {
    return [];
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
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("upcoming_games")
      .select("*")
      .order("progress_percentage", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data as UpcomingGame[]) ?? [];
  } catch {
    return [];
  }
}

export interface AdminStats {
  games: number;
  versions: number;
  requests: number;
  downloads: number;
}

export async function getAllGamesForAdmin(): Promise<Game[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Game[]) ?? [];
  } catch {
    return [];
  }
}

export async function getGameById(id: string): Promise<Game | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data } = await supabase
      .from("games")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return (data as Game) ?? null;
  } catch {
    return null;
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
  if (!isSupabaseConfigured())
    return { games: 0, versions: 0, requests: 0, downloads: 0 };
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
    return {
      games: games.count ?? 0,
      versions: versions.count ?? 0,
      requests: requests.count ?? 0,
      downloads: downloadTotal,
    };
  } catch {
    return { games: 0, versions: 0, requests: 0, downloads: 0 };
  }
}
