"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/lib/action-types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { RequestStatus } from "@/lib/types";

async function staffGuard() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role as string | undefined;
  if (role !== "admin" && role !== "editor") return null;
  return { supabase };
}

function revalidateSite(locale: string) {
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/games`);
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/admin/games`);
}

export async function saveGameAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ctx = await staffGuard();
  if (!ctx) return { ok: false, error: "forbidden" };
  const { supabase } = ctx;

  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "").trim();
  const titleAr = String(formData.get("title_ar") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const descriptionAr = String(formData.get("description_ar") ?? "").trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const steamUrl = String(formData.get("steam_url") ?? "").trim();
  const published = formData.get("published") === "on";
  let slug = slugify(String(formData.get("slug") ?? "").trim() || titleEn);

  if (!titleAr || !titleEn) return { ok: false, error: "required" };
  if (!slug) slug = `game-${Date.now()}`;

  // Custom metadata fields (Specifications matching Hesham's site)
  const knownAs = String(formData.get("known_as") ?? "").trim();
  const developer = String(formData.get("developer") ?? "").trim();
  const publisher = String(formData.get("publisher") ?? "").trim();
  const year = String(formData.get("release_year") ?? "").trim();
  const genre = String(formData.get("genre") ?? "").trim();
  const platforms = String(formData.get("platforms") ?? "").trim();
  const officialUrl = String(formData.get("official_url") ?? "").trim() || steamUrl;
  const trailerUrl = String(formData.get("trailer_url") ?? "").trim();
  const aboutGame = String(formData.get("about_game") ?? "").trim() || descriptionAr;
  const highlightsRaw = String(formData.get("highlights") ?? "").trim();
  const highlights = highlightsRaw
    ? highlightsRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  const screenshotsRaw = String(formData.get("screenshots") ?? "").trim();
  let screenshots: string[] = [];
  try {
    screenshots = screenshotsRaw ? JSON.parse(screenshotsRaw) : [];
  } catch {
    screenshots = screenshotsRaw
      ? screenshotsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
  }

  // Extract clean YouTube video ID if URL is provided
  let youtubeId = "";
  if (trailerUrl) {
    const match = trailerUrl.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*)/);
    youtubeId = match && match[1] && match[1].length === 11 ? match[1] : trailerUrl;
  }

  const metaPayload = {
    knownAs,
    developer,
    publisher,
    year,
    genre,
    platforms: platforms || "PC",
    officialUrl,
    trailerYoutubeId: youtubeId,
    trailerUrl,
    aboutGame,
    highlights,
    screenshots,
  };

  const payload = {
    slug,
    title_ar: titleAr,
    title_en: titleEn,
    description_ar: aboutGame || null,
    description_en: JSON.stringify(metaPayload),
    cover_url: coverUrl || null,
    steam_url: steamUrl || officialUrl || null,
    published,
  };

  if (id) {
    const { error } = await supabase.from("games").update(payload).eq("id", id);
    if (error) {
      if (error.code === "23505") return { ok: false, error: "slug_taken" };
      return { ok: false, error: "unknown" };
    }
    revalidateSite(locale);
    revalidatePath(`/${locale}/games/${slug}`);
    return { ok: true, message: "updated" };
  }

  let { error } = await supabase.from("games").insert(payload);
  if (error?.code === "23505") {
    // Slug collision: retry once with a short suffix.
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    ({ error } = await supabase.from("games").insert({ ...payload, slug }));
  }
  if (error) return { ok: false, error: "unknown" };

  revalidateSite(locale);
  revalidatePath(`/${locale}/games/${slug}`);
  return { ok: true, message: "created" };
}

export async function deleteGameAction(
  id: string,
  locale = "ar",
): Promise<FormState> {
  const ctx = await staffGuard();
  if (!ctx) return { ok: false, error: "forbidden" };
  const { error } = await ctx.supabase.from("games").delete().eq("id", id);
  if (error) return { ok: false, error: "unknown" };
  revalidateSite(locale);
  return { ok: true };
}

export async function saveVersionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ctx = await staffGuard();
  if (!ctx) return { ok: false, error: "forbidden" };
  const { supabase } = ctx;

  const locale = String(formData.get("locale") ?? "ar");
  const gameId = String(formData.get("game_id") ?? "").trim();
  const version = String(formData.get("version") ?? "").trim();
  const releaseDate = String(formData.get("release_date") ?? "").trim();
  const notesAr = String(formData.get("notes_ar") ?? "").trim();
  const notesEn = String(formData.get("notes_en") ?? "").trim();
  const downloadUrl = String(formData.get("download_url") ?? "").trim();
  const platform = String(formData.get("platform") ?? "").trim();
  const fileSize = String(formData.get("file_size") ?? "").trim();

  if (!gameId || !version || !downloadUrl)
    return { ok: false, error: "required" };

  const versionMeta = {
    platform: platform || "PC (Windows)",
    fileSize: fileSize || "",
    notes: notesEn,
  };

  const { error } = await supabase.from("versions").insert({
    game_id: gameId,
    version,
    release_date: releaseDate || null,
    notes_ar: notesAr || null,
    notes_en: JSON.stringify(versionMeta),
    download_url: downloadUrl,
  });
  if (error) return { ok: false, error: "unknown" };

  revalidateSite(locale);
  revalidatePath(`/${locale}/games`);
  return { ok: true, message: "created" };
}

export async function deleteVersionAction(
  id: string,
  locale = "ar",
): Promise<FormState> {
  const ctx = await staffGuard();
  if (!ctx) return { ok: false, error: "forbidden" };
  const { error } = await ctx.supabase.from("versions").delete().eq("id", id);
  if (error) return { ok: false, error: "unknown" };
  revalidateSite(locale);
  return { ok: true };
}

export async function updateRequestStatusAction(
  id: string,
  status: RequestStatus,
  locale = "ar",
): Promise<FormState> {
  const ctx = await staffGuard();
  if (!ctx) return { ok: false, error: "forbidden" };
  const { error } = await ctx.supabase
    .from("requests")
    .update({ status })
    .eq("id", id);
  if (error) return { ok: false, error: "unknown" };
  revalidatePath(`/${locale}/admin/requests`);
  revalidatePath(`/${locale}/request`);
  return { ok: true };
}

export async function updateSettingsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ctx = await staffGuard();
  if (!ctx) return { ok: false, error: "forbidden" };

  const locale = String(formData.get("locale") ?? "ar");
  const field = (name: string) => {
    const value = String(formData.get(name) ?? "").trim();
    return value || null;
  };

  const { error } = await ctx.supabase.from("site_settings").upsert({
    id: 1,
    site_name_ar: String(formData.get("site_name_ar") ?? "ArgusArGames").trim(),
    site_name_en: String(formData.get("site_name_en") ?? "ArgusArGames").trim(),
    social_facebook: field("social_facebook"),
    social_twitter: field("social_twitter"),
    social_reddit: field("social_reddit"),
    social_discord: field("social_discord"),
    social_telegram: field("social_telegram"),
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: "unknown" };

  revalidatePath(`/${locale}`, "layout");
  return { ok: true, message: "saved" };
}
