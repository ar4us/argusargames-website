"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import type { FormState } from "@/lib/action-types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { clearMemoryCache } from "@/lib/queries";
import { slugify } from "@/lib/utils";
import type { RequestStatus } from "@/lib/types";
import { getProfile } from "@/lib/auth";

async function staffGuard() {
  if (!isSupabaseConfigured()) return null;
  const profile = await getProfile();
  if (!profile) return null;
  if (profile.role !== "admin" && profile.role !== "editor") return null;
  const supabase = await createClient();
  return { supabase, profile };
}

function revalidateSite(locale: string) {
  clearMemoryCache();
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

  const patchType = String(formData.get("patch_type") ?? "").trim() || "استبدال ملفات اللعبة";
  const status = String(formData.get("status") ?? "").trim() || "مكتمل 100%";
  const fileSize = String(formData.get("file_size") ?? "").trim();
  const compatibilityNotes = String(formData.get("compatibility_notes") ?? "").trim();

  // Parse install steps from formatted textarea (one step per line: عنوان: شرح)
  const installStepsRaw = String(formData.get("install_steps") ?? "").trim();
  let installSteps: { step: number; title: string; description: string }[] = [];
  if (installStepsRaw) {
    const lines = installStepsRaw.split("\n").map((l) => l.trim()).filter(Boolean);
    installSteps = lines.map((line, idx) => {
      const parts = line.split(":");
      if (parts.length > 1) {
        return {
          step: idx + 1,
          title: parts[0].trim(),
          description: parts.slice(1).join(":").trim(),
        };
      }
      return {
        step: idx + 1,
        title: `الخطوة ${idx + 1}`,
        description: line,
      };
    });
  }

  const metaPayload = {
    knownAs,
    developer,
    publisher,
    year,
    genre,
    platforms: platforms || "PC",
    officialUrl,
    trailerYoutubeId: "",
    trailerUrl: "",
    aboutGame,
    highlights,
    screenshots,
    fileSize,
    patchType,
    status,
    installSteps: installSteps.length > 0 ? installSteps : undefined,
    compatibilityNotes: compatibilityNotes || undefined,
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

  try {
    // 1. Persist to Supabase Database
    if (id) {
      const { error } = await supabase.from("games").update(payload).eq("id", id);
      if (error) {
        console.error("Supabase update error:", error);
        if (error.code === "23505") return { ok: false, error: "slug_taken" };
        return { ok: false, error: error.message || "unknown" };
      }
    } else {
      let { error } = await supabase.from("games").insert(payload);
      if (error?.code === "23505") {
        slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
        ({ error } = await supabase.from("games").insert({ ...payload, slug }));
      }
      if (error) {
        console.error("Supabase insert error:", error);
        return { ok: false, error: error.message || "unknown" };
      }
    }

    // 2. Sync to local data/games.json if available
    try {
      const jsonPath = path.join(process.cwd(), "data", "games.json");
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, "utf8");
        const list = JSON.parse(raw);
        const targetId = id || slug;
        const idx = list.findIndex((g: any) => g.id === targetId || g.slug === slug);
        const gameItem = {
          id: targetId,
          slug,
          title_ar: titleAr,
          title_en: titleEn,
          known_as: knownAs || titleAr,
          genre: genre || "ألعاب مغامرات ورعب",
          year: year || "2024",
          developer: developer || "مطور مستقل",
          publisher: publisher || developer || "ناشر مستقل",
          platforms: platforms || "PC",
          official_url: officialUrl || steamUrl || "",
          trailer_youtube_id: "",
          cover_url: coverUrl || `/images/covers/${slug}.jpg`,
          download_url: "",
          version: "1.0",
          file_size: fileSize || "غير محدد",
          patch_type: patchType,
          status: status,
          about_game: aboutGame || "",
          highlights: highlights.length > 0 ? highlights : [
            "تعريب كامل لكافة القوائم والحوارات والنصوص",
            "خطوط عربية واضحة ومريحة للقراءة داخل اللعبة",
            "متوافق مع أحدث التحديثات الرسمية على الحاسب الشخصي PC"
          ],
          screenshots: screenshots,
          install_steps: installSteps.length > 0 ? installSteps : [
            { step: 1, title: "تحميل الباتش", description: "فك الضغط عن ملف الباتش المضغوط." },
            { step: 2, title: "استبدال الملفات", description: "انقل ملفات التعريب إلى مجلد اللعبة الرئيسي." },
            { step: 3, title: "التشغيل", description: "شغل اللعبة واستمتع بالتجربة باللغة العربية." }
          ],
          compatibility_notes: compatibilityNotes || "",
        };

        if (idx !== -1) {
          list[idx] = { ...list[idx], ...gameItem };
        } else {
          list.push(gameItem);
        }
        fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2), "utf8");
      }
    } catch (jErr) {
      console.warn("Failed to sync data/games.json:", jErr);
    }

    revalidateSite(locale);
    revalidatePath(`/${locale}/games/${slug}`);
    return { ok: true, message: id ? "updated" : "created" };
  } catch (err: any) {
    console.error("saveGameAction exception:", err);
    return { ok: false, error: err?.message || "unknown" };
  }
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

export async function saveUpcomingGameAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ctx = await staffGuard();
  if (!ctx) return { ok: false, error: "forbidden" };

  const locale = String(formData.get("locale") ?? "ar");
  const id = String(formData.get("id") ?? "").trim();
  const titleAr = String(formData.get("title_ar") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  let slug = slugify(String(formData.get("slug") ?? "").trim() || titleEn);
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const progressPercentage = Math.min(
    100,
    Math.max(0, Number(formData.get("progress_percentage") ?? 0)),
  );
  const status = String(formData.get("status") ?? "قيد التعريب").trim();
  const expectedDate = String(formData.get("expected_date") ?? "").trim();
  const platforms = String(formData.get("platforms") ?? "PC").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!titleAr || !titleEn) return { ok: false, error: "required" };
  if (!slug) slug = `upcoming-${Date.now()}`;

  const payload = {
    title_ar: titleAr,
    title_en: titleEn,
    slug,
    cover_url: coverUrl || null,
    progress_percentage: progressPercentage,
    status: status || "قيد التعريب",
    expected_date: expectedDate || null,
    platforms: platforms || "PC",
    description: description || null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await ctx.supabase
      .from("upcoming_games")
      .update(payload)
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await ctx.supabase
      .from("upcoming_games")
      .insert(payload);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/admin/upcoming`);
  return { ok: true };
}

export async function deleteUpcomingGameAction(
  id: string,
  locale = "ar",
): Promise<FormState> {
  const ctx = await staffGuard();
  if (!ctx) return { ok: false, error: "forbidden" };

  const { error } = await ctx.supabase
    .from("upcoming_games")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/admin/upcoming`);
  return { ok: true };
}

