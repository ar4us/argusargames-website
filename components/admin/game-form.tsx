"use client";

import { Trash2, Upload, Plus, Image as ImageIcon, Film, Gamepad2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { saveGameAction } from "@/lib/actions/admin";
import { useRouter } from "@/i18n/navigation";
import { initialFormState } from "@/lib/action-types";
import { Button, Spinner } from "@/components/ui/button";
import { Checkbox, FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import type { Game } from "@/lib/types";
import { getGameExtra } from "@/lib/game-details";

export function GameForm({
  game,
  live = false,
}: {
  game?: Game | null;
  live?: boolean;
}) {
  const t = useTranslations("admin.games");
  const tc = useTranslations("common");
  const locale = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const screenshotFileRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState(saveGameAction, {
    ...initialFormState,
  });

  // Extract initial values from game or existing defaults
  const extra = game ? getGameExtra(game.slug, game.description_en) : null;

  const [coverUrl, setCoverUrl] = useState(game?.cover_url ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Screenshots state
  const [screenshots, setScreenshots] = useState<string[]>(
    extra?.screenshots && extra.screenshots.length > 0 ? extra.screenshots : []
  );
  const [screenshotInputUrl, setScreenshotInputUrl] = useState("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  // Specifications
  const [knownAs, setKnownAs] = useState(extra?.knownAs ?? "");
  const [developer, setDeveloper] = useState(extra?.developer ?? "");
  const [publisher, setPublisher] = useState(extra?.publisher ?? "");
  const [releaseYear, setReleaseYear] = useState(extra?.year ?? "");
  const [genre, setGenre] = useState(extra?.genre ?? "");
  const [platforms, setPlatforms] = useState(extra?.platforms ?? "PC");
  const [trailerUrl, setTrailerUrl] = useState(
    extra?.trailerYoutubeId
      ? `https://www.youtube.com/watch?v=${extra.trailerYoutubeId}`
      : extra?.trailerUrl ?? ""
  );
  const [officialUrl, setOfficialUrl] = useState(
    extra?.officialUrl ?? game?.steam_url ?? ""
  );
  const [aboutGame, setAboutGame] = useState(
    extra?.aboutGame ?? game?.description_ar ?? ""
  );
  const [highlights, setHighlights] = useState(
    extra?.highlights ? extra.highlights.join("\n") : ""
  );

  // Upload cover image
  const uploadCover = async (file: File) => {
    setUploadingCover(true);
    try {
      const supabase = createClient();
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .toLowerCase()
        .slice(-40);
      const path = `games/${Date.now()}-${safeName}`;
      const { data, error } = await supabase.storage
        .from("covers")
        .upload(path, compressed, {
          contentType: file.type || "image/jpeg",
          upsert: false,
          cacheControl: "31536000",
        });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("covers").getPublicUrl(data.path);
      setCoverUrl(publicUrl);
    } catch (err) {
      console.error("cover upload failed", err);
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload localization screenshot
  const uploadScreenshot = async (file: File) => {
    setUploadingScreenshot(true);
    try {
      const supabase = createClient();
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .toLowerCase()
        .slice(-40);
      const path = `screenshots/${Date.now()}-${safeName}`;
      const { data, error } = await supabase.storage
        .from("covers")
        .upload(path, compressed, {
          contentType: file.type || "image/jpeg",
          upsert: false,
          cacheControl: "31536000",
        });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("covers").getPublicUrl(data.path);
      setScreenshots((prev) => [...prev, publicUrl]);
    } catch (err) {
      console.error("screenshot upload failed", err);
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const addManualScreenshot = () => {
    if (!screenshotInputUrl.trim()) return;
    setScreenshots((prev) => [...prev, screenshotInputUrl.trim()]);
    setScreenshotInputUrl("");
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="id" value={game?.id ?? ""} />
      {live ? <input type="hidden" name="published" value="on" /> : null}
      <input type="hidden" name="cover_url" value={coverUrl} />
      <input type="hidden" name="screenshots" value={JSON.stringify(screenshots)} />

      {/* =========================================================================
          1. COVER IMAGE
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-surface-2/40 p-4 sm:p-5">
        <Label className="text-sm font-bold text-foreground mb-3 block">
          غلاف اللعبة (Cover Image)
        </Label>
        <div className="flex items-start gap-4">
          <div className="relative aspect-[16/9] w-36 sm:w-44 shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
            {coverUrl ? (
              <>
                <Image
                  src={coverUrl}
                  alt=""
                  fill
                  sizes="176px"
                  className="object-cover"
                />
                <button
                  type="button"
                  aria-label={tc("delete")}
                  onClick={() => setCoverUrl("")}
                  className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black/90 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-muted">
                {t("coverPreview")}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadCover(file);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploadingCover}
              onClick={() => fileRef.current?.click()}
              className="gap-2"
            >
              {uploadingCover ? <Spinner /> : <Upload className="h-4 w-4" />}
              {t("upload")}
            </Button>
            <p className="text-xs text-muted leading-relaxed">
              يفضل رفع غلاف أفقي بدقة 16:9 بنسبة عرض (مثال: 1920x1080 أو 616x353).
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. GAME TITLES & NAMES
         ========================================================================= */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="title_ar">
            الاسم بالعربية <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title_ar"
            name="title_ar"
            defaultValue={game?.title_ar ?? ""}
            placeholder="مثال: باكسيت: رحلة المقعد الخلفي"
            dir="rtl"
            required
          />
        </div>
        <div>
          <Label htmlFor="title_en">
            الاسم الأصلي بالإنجليزية <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title_en"
            name="title_en"
            defaultValue={game?.title_en ?? ""}
            placeholder="مثال: Backseat"
            dir="ltr"
            required
          />
        </div>
        <div>
          <Label htmlFor="known_as">يُعرف أيضاً بـ (اسم بديل)</Label>
          <Input
            id="known_as"
            name="known_as"
            value={knownAs}
            onChange={(e) => setKnownAs(e.target.value)}
            placeholder="مثال: ديسونرد 2 / المقعد الخلفي"
            dir="rtl"
          />
        </div>
      </div>

      {/* =========================================================================
          3. GAME SPECIFICATIONS (MATCHING HESHAM'S SITE EXACT TABLE)
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Gamepad2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-foreground">
            معلومات ومواصفات اللعبة (Specs & Info)
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="developer">المطور (Developer)</Label>
            <Input
              id="developer"
              name="developer"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              placeholder="مثال: Arkane Lyon / Remedy"
              dir="ltr"
            />
          </div>
          <div>
            <Label htmlFor="publisher">الناشر (Publisher)</Label>
            <Input
              id="publisher"
              name="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="مثال: Bethesda Softworks / Konami"
              dir="ltr"
            />
          </div>
          <div>
            <Label htmlFor="release_year">تاريخ / سنة الصدور</Label>
            <Input
              id="release_year"
              name="release_year"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="مثال: 11 نوفمبر 2016 أو 2024"
            />
          </div>
          <div>
            <Label htmlFor="genre">النوع / التصنيف (Genre)</Label>
            <Input
              id="genre"
              name="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="مثال: أكشن وتسلل / رعب نفسي"
              dir="rtl"
            />
          </div>
          <div>
            <Label htmlFor="platforms">المنصات (Platforms)</Label>
            <Input
              id="platforms"
              name="platforms"
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              placeholder="مثال: PC, PlayStation 4, Xbox One"
              dir="ltr"
            />
          </div>
          <div>
            <Label htmlFor="official_url">الموقع الرسمي / رابط Steam</Label>
            <Input
              id="official_url"
              name="official_url"
              value={officialUrl}
              onChange={(e) => setOfficialUrl(e.target.value)}
              placeholder="https://store.steampowered.com/app/..."
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="trailer_url">
            رابط العرض الرسمي للتعريب (YouTube Trailer)
          </Label>
          <div className="relative">
            <Input
              id="trailer_url"
              name="trailer_url"
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              placeholder="مثال: https://www.youtube.com/watch?v=..."
              dir="ltr"
            />
          </div>
          <p className="mt-1 text-xs text-muted">
            يمكنك وضع رابط الفيديو كاملاً على يوتيوب أو معرف الفيديو ليتم عرضه في مشغل 1080p الرسمي.
          </p>
        </div>
      </div>

      {/* =========================================================================
          4. ABOUT THE GAME & KEY HIGHLIGHTS
         ========================================================================= */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-3">
          <Label htmlFor="about_game" className="text-sm font-bold text-foreground">
            عن اللعبة (About the Game)
          </Label>
          <Textarea
            id="about_game"
            name="about_game"
            value={aboutGame}
            onChange={(e) => setAboutGame(e.target.value)}
            placeholder="اكتب هنا نبذة مفصلة عن قصة اللعبة وأسلوب اللعب بالعربية..."
            dir="rtl"
            rows={7}
            className="leading-relaxed"
          />
          <p className="text-xs text-muted">
            يظهر هذا الوصف في قسم "عن اللعبة" بجانب جدول مواصفات اللعبة.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <Label htmlFor="highlights" className="text-sm font-bold text-foreground">
              أبرز ما فيها (Key Highlights)
            </Label>
          </div>
          <Textarea
            id="highlights"
            name="highlights"
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="اكتب كل ميزة في سطر منفصل، مثال:
شخصيتان قابلتان للعب، لكل منهما قدرات خارقة خاصة
حرية كاملة بين التسلل والقتال مع إمكانية إنهاء اللعبة دون قتل
مراحل متعددة المسارات وقصر الآليات المبتكر"
            dir="rtl"
            rows={7}
            className="leading-relaxed"
          />
          <p className="text-xs text-muted">
            اكتب ميزة واحدة في كل سطر. ستظهر برمز الألماسة الذهبية 🔶 في صفحة اللعبة.
          </p>
        </div>
      </div>

      {/* =========================================================================
          5. ARABIC LOCALIZATION SCREENSHOTS UPLOAD & MANAGEMENT
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-foreground">
              صور وسكرين شوتات من التعريب (Screenshots)
            </h3>
          </div>
          <span className="text-xs font-semibold text-muted">
            {screenshots.length} صور مضافة
          </span>
        </div>

        {/* Upload Button & Manual URL */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={screenshotFileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadScreenshot(file);
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={uploadingScreenshot}
            onClick={() => screenshotFileRef.current?.click()}
            className="gap-2 shrink-0"
          >
            {uploadingScreenshot ? <Spinner /> : <Upload className="h-4 w-4" />}
            <span>رفع سكرين شوت من الجهاز</span>
          </Button>

          <div className="flex flex-1 gap-2">
            <Input
              value={screenshotInputUrl}
              onChange={(e) => setScreenshotInputUrl(e.target.value)}
              placeholder="أو الصق رابط صورة خارجية مباشرة..."
              dir="ltr"
              className="text-xs"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={addManualScreenshot}
              className="gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة</span>
            </Button>
          </div>
        </div>

        {/* Screenshots Grid / Preview */}
        {screenshots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {screenshots.map((url, i) => (
              <div
                key={i}
                className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-2"
              >
                <Image
                  src={url}
                  alt={`معاينة ${i + 1}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeScreenshot(i)}
                  className="absolute top-1.5 end-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition-opacity hover:bg-red-700"
                  aria-label="حذف الصورة"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span className="absolute bottom-1.5 start-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  صورة {i + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted">
            لم يتم رفع أي سكرين شوت للتعريب بعد. اضغط على الزر أعلاه لرفع صور من الحوارات والقوائم العربية.
          </div>
        )}
      </div>

      {/* =========================================================================
          6. SLUG & PUBLISHED SETTINGS
         ========================================================================= */}
      <div className="grid gap-4 sm:grid-cols-2 items-center rounded-2xl border border-border bg-surface-2/30 p-4">
        <div>
          <Label htmlFor="slug">{t("slug")}</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={game?.slug ?? ""}
            placeholder={t("slugPlaceholder")}
            dir="ltr"
          />
        </div>

        {!live && (
          <div className="flex items-center gap-2 pt-5 sm:pt-6">
            <Checkbox
              id="published"
              name="published"
              defaultChecked={game?.published ?? true}
            />
            <Label htmlFor="published" className="cursor-pointer font-medium">
              {t("published")}
            </Label>
          </div>
        )}
      </div>

      <FieldError>{state.ok ? null : state.error ? tc("error") : null}</FieldError>

      {state.ok && (
        <p className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          تم حفظ وتحديث بيانات اللعبة والتعريب بنجاح!
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending} size="lg" className="min-w-32">
          {pending ? <Spinner /> : null}
          {game ? tc("save") : t("create")}
        </Button>
      </div>
    </form>
  );
}