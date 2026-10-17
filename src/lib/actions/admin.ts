import type { FormState } from "@/lib/action-types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { RequestStatus } from "@/lib/types";

export async function saveGameAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured()) return { ok: false, error: "forbidden" };

  const id = String(formData.get("id") ?? "").trim();
  const titleAr = String(formData.get("title_ar") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const descriptionAr = String(formData.get("description_ar") || formData.get("about_game") || "").trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const steamUrl = String(formData.get("steam_url") || formData.get("official_url") || "").trim();
  const publishedVal = formData.get("published");
  const published = publishedVal === "on" || publishedVal === "true" || publishedVal === "1";
  let slug = slugify(String(formData.get("slug") ?? "").trim() || titleEn);

  if (!titleAr || !titleEn) return { ok: false, error: "required" };
  if (!slug) slug = `game-${Date.now()}`;

  const payload: any = {
    title_ar: titleAr,
    title_en: titleEn,
    description_ar: descriptionAr || null,
    cover_url: coverUrl || null,
    steam_url: steamUrl || null,
    published,
    slug,
  };

  try {
    if (id) {
      const { error } = await supabase.from("games").update(payload).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase.from("games").insert(payload);
      if (error) return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "unknown" };
  }
}

export async function deleteGameAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "missing_id" };
  try {
    const { error } = await supabase.from("games").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "unknown" };
  }
}

export async function saveVersionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "").trim();
  const gameId = String(formData.get("game_id") ?? "").trim();
  const version = String(formData.get("version") ?? "").trim();
  const releaseDate = String(formData.get("release_date") ?? "").trim() || null;
  const downloadUrl = String(formData.get("download_url") ?? "").trim();
  const notesAr = String(formData.get("notes_ar") ?? "").trim() || null;

  if (!gameId || !version || !downloadUrl) {
    return { ok: false, error: "required" };
  }

  const payload = {
    game_id: gameId,
    version,
    release_date: releaseDate,
    download_url: downloadUrl,
    notes_ar: notesAr,
  };

  try {
    if (id) {
      const { error } = await supabase.from("versions").update(payload).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase.from("versions").insert(payload);
      if (error) return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "unknown" };
  }
}

export async function deleteVersionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "missing_id" };
  try {
    const { error } = await supabase.from("versions").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "unknown" };
  }
}

export async function updateRequestStatusAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as RequestStatus;
  if (!id || !status) return { ok: false, error: "required" };
  try {
    const { error } = await supabase.from("requests").update({ status }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "unknown" };
  }
}

export async function saveUpcomingGameAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "").trim();
  const titleAr = String(formData.get("title_ar") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const progressPercentage = Number(formData.get("progress_percentage") ?? 0);
  const status = String(formData.get("status") ?? "قيد العمل").trim();
  const expectedDate = String(formData.get("expected_date") ?? "").trim() || null;
  const platforms = String(formData.get("platforms") ?? "PC").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  let slug = slugify(String(formData.get("slug") ?? "").trim() || titleEn);

  if (!titleAr || !titleEn) return { ok: false, error: "required" };
  if (!slug) slug = `upcoming-${Date.now()}`;

  const payload = {
    title_ar: titleAr,
    title_en: titleEn,
    cover_url: coverUrl || null,
    progress_percentage: Math.min(100, Math.max(0, progressPercentage)),
    status,
    expected_date: expectedDate,
    platforms,
    description,
    slug,
  };

  try {
    if (id) {
      const { error } = await supabase
        .from("upcoming_games")
        .update(payload)
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase.from("upcoming_games").insert(payload);
      if (error) return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "unknown" };
  }
}

export async function deleteUpcomingGameAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "missing_id" };
  try {
    const { error } = await supabase.from("upcoming_games").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "unknown" };
  }
}

export const updateSettingsAction = saveSettingsAction;

export async function saveSettingsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const payload = {
    site_name_ar: String(formData.get("site_name_ar") ?? "").trim(),
    site_name_en: String(formData.get("site_name_en") ?? "").trim(),
    social_twitter: String(formData.get("social_twitter") ?? "").trim() || null,
    social_discord: String(formData.get("social_discord") ?? "").trim() || null,
    social_telegram: String(formData.get("social_telegram") ?? "").trim() || null,
    social_reddit: String(formData.get("social_reddit") ?? "").trim() || null,
    social_facebook: String(formData.get("social_facebook") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...payload });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "unknown" };
  }
}
