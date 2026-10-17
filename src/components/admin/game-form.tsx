"use client";

import { Trash2, Upload, Plus, Image as ImageIcon, Film, Gamepad2, Sparkles, CheckCircle2, AlertCircle, Download, Terminal, Wrench } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useRef, useState } from "react";
import { saveGameAction } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/action-types";
import { Button, Spinner } from "@/components/ui/button";
import { Checkbox, FieldError, Input, Label, Textarea } from "@/components/ui/field";
import type { Game } from "@/lib/types";
import { getGameExtra } from "@/lib/game-details";

interface ScreenshotItem {
  url: string;
  name?: string;
}

// Client-side image processor: compresses and resizes to lightweight high quality WebP/JPEG data URL (~35KB-50KB)
async function processImageFile(file: File, maxWidth = 960, quality = 0.70): Promise<{ url: string; name: string }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("الملف المحدد ليس صورة صالحة"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = document.createElement("img");
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve({ url: result, name: file.name });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP first, fallback to JPEG
          try {
            const webpData = canvas.toDataURL("image/webp", quality);
            resolve({ url: webpData, name: file.name });
          } catch {
            const jpegData = canvas.toDataURL("image/jpeg", quality);
            resolve({ url: jpegData, name: file.name });
          }
        } catch {
          resolve({ url: result, name: file.name });
        }
      };
      img.onerror = () => resolve({ url: result, name: file.name });
      img.src = result;
    };
    reader.onerror = () => reject(new Error("تعذر قراءة ملف الصورة من جهازك"));
    reader.readAsDataURL(file);
  });
}

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

  // Screenshots state with names
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>(() => {
    if (!extra?.screenshots || extra.screenshots.length === 0) return [];
    return extra.screenshots.map((s, idx) => ({
      url: s,
      name: s.startsWith("data:") ? `لقطة ${idx + 1}` : s.split("/").pop() || `لقطة ${idx + 1}`,
    }));
  });

  const [screenshotInputUrl, setScreenshotInputUrl] = useState("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  // Patch Details & Technical Specifications
  const [fileSize, setFileSize] = useState(extra?.fileSize ?? "20 ميغابايت");
  const [patchType, setPatchType] = useState(extra?.patchType ?? "استبدال ملفات اللعبة");
  const [status, setStatus] = useState(extra?.status ?? "مكتمل 100%");
  const [compatibilityNotes, setCompatibilityNotes] = useState(
    extra?.compatibilityNotes ?? "متوافق مع أحدث إصدارات اللعبة على نظام Windows (PC)."
  );
  const [installStepsText, setInstallStepsText] = useState(() => {
    if (extra?.installSteps && extra.installSteps.length > 0) {
      return extra.installSteps
        .map((s) => `${s.title}: ${s.description}`)
        .join("\n");
    }
    return `تحميل الباتش: فك الضغط عن ملف الباتش المضغوط.
استبدال الملفات: انقل ملفات التعريب إلى مجلد اللعبة الرئيسي.
التشغيل: شغل اللعبة واستمتع بالتجربة باللغة العربية.`;
  });

  // Upload cover image
  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", game?.slug || "cover");
      const res = await fetch("/api/admin/upload-cover", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        setCoverUrl(data.url);
        setUploadNotice("تم رفع غلاف اللعبة وحفظه بنجاح!");
      } else {
        const processed = await processImageFile(file, 960, 0.75);
        setCoverUrl(processed.url);
        setUploadNotice("تم تحديث غلاف اللعبة بنجاح!");
      }
      setTimeout(() => setUploadNotice(null), 4000);
    } catch {
      const processed = await processImageFile(file, 960, 0.75);
      setCoverUrl(processed.url);
      setUploadNotice("تم تحديث غلاف اللعبة بنجاح!");
      setTimeout(() => setUploadNotice(null), 4000);
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload localization screenshots (supports multiple files)
  const handleScreenshotUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingScreenshot(true);
    setUploadError(null);

    const newItems: ScreenshotItem[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let uploaded = false;

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("slug", game?.slug || "screen");
          const res = await fetch("/api/admin/upload-screenshot", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.ok && data.url) {
            newItems.push({
              url: data.url,
              name: data.fileName || file.name,
            });
            uploaded = true;
          }
        } catch {}

        if (!uploaded) {
          const processed = await processImageFile(file, 960, 0.70);
          newItems.push({
            url: processed.url,
            name: processed.name || file.name,
          });
        }
      }

      setScreenshots((prev) => [...prev, ...newItems]);
      setUploadNotice(`تمت إضافة ${newItems.length} سكرين شوت بنجاح!`);
      setTimeout(() => setUploadNotice(null), 4000);
    } catch (err: any) {
      setUploadError(err?.message || "فشل رفع السكرين شوتات");
    } finally {
      setUploadingScreenshot(false);
      if (screenshotFileRef.current) {
        screenshotFileRef.current.value = "";
      }
    }
  };

  const addManualScreenshot = () => {
    if (!screenshotInputUrl.trim()) return;
    const trimmed = screenshotInputUrl.trim();
    const name = trimmed.split("/").pop() || `لقطة ${screenshots.length + 1}`;
    setScreenshots((prev) => [...prev, { url: trimmed, name }]);
    setScreenshotInputUrl("");
    setUploadNotice("تمت إضافة رابط السكرين شوت بنجاح!");
    setTimeout(() => setUploadNotice(null), 3000);
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
      <input
        type="hidden"
        name="screenshots"
        value={JSON.stringify(screenshots.map((s) => s.url))}
      />

      {/* Global Notice / Feedback */}
      {uploadNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

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
                  unoptimized={coverUrl.startsWith("data:")}
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
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleCoverUpload(file);
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
          5. PATCH DOWNLOAD & INSTALLATION DETAILS (DYNAMICS)
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-5">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-foreground">
              معلومات الباتش والتحميل وطريقة التثبيت خطوة بخطوة
            </h3>
          </div>
          <span className="text-xs text-muted">تظهر في بطاقة التحميل الرئيسية</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="file_size">حجم ملف التعريب / التحميل</Label>
            <Input
              id="file_size"
              name="file_size"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              placeholder="مثال: 89 ميغابايت أو 1.2 جيجابايت"
              dir="rtl"
            />
            <p className="mt-1 text-[11px] text-muted">
              يظهر في صندوق التحميل وبطاقة مواصفات الباتش.
            </p>
          </div>

          <div>
            <Label htmlFor="status">حالة التعريب</Label>
            <Input
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="مثال: مكتمل 100% أو نسخة تجريبية"
              dir="rtl"
            />
            <p className="mt-1 text-[11px] text-muted">
              مثال: مكتمل 100%، قيد التطوير، تجريبي...
            </p>
          </div>

          <div>
            <Label htmlFor="patch_type">نوع التثبيت</Label>
            <Input
              id="patch_type"
              name="patch_type"
              value={patchType}
              onChange={(e) => setPatchType(e.target.value)}
              placeholder="مثال: استبدال ملفات اللعبة أو مثبت تلقائي"
              dir="rtl"
            />
            <p className="mt-1 text-[11px] text-muted">
              مثال: حزمة استبدال ملفات اللعبة، باتش EXE...
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <Label htmlFor="install_steps" className="font-bold">
              طريقة التثبيت خطوة بخطوة (عنوان الخطوة: الشرح)
            </Label>
          </div>
          <Textarea
            id="install_steps"
            name="install_steps"
            value={installStepsText}
            onChange={(e) => setInstallStepsText(e.target.value)}
            rows={5}
            dir="rtl"
            className="leading-relaxed font-mono text-xs"
            placeholder={`اكتب كل خطوة في سطر بالشكل (العنوان: الشرح)، مثال:
تحميل الباتش: حمّل ملف الباتش المضغوط وفك الضغط عنه.
استبدال الملفات: انقل الملفات إلى مجلد اللعبة الرئيسي داخل Content/Paks.
التشغيل: شغل اللعبة واستمتع بالتجربة باللغة العربية.`}
          />
          <p className="text-[11px] text-muted">
            تنسيق: <span className="font-bold">العنوان: الشرح</span> في كل سطر. يتم ترقيم الخطوات تلقائياً (1، 2، 3...).
          </p>
        </div>

        <div>
          <Label htmlFor="compatibility_notes">ملاحظات التوافقية (شريط التنبيه السفلي)</Label>
          <Input
            id="compatibility_notes"
            name="compatibility_notes"
            value={compatibilityNotes}
            onChange={(e) => setCompatibilityNotes(e.target.value)}
            placeholder="مثال: متوافق مع أحدث إصدارات اللعبة على نظام Windows (PC)."
            dir="rtl"
          />
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
            accept="image/png,image/jpeg,image/webp,image/jpg"
            multiple
            className="hidden"
            onChange={(e) => {
              void handleScreenshotUpload(e.target.files);
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={uploadingScreenshot}
            onClick={() => screenshotFileRef.current?.click()}
            className="gap-2 shrink-0 bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 border-blue-500/20"
          >
            {uploadingScreenshot ? <Spinner /> : <Upload className="h-4 w-4" />}
            <span>رفع سكرين شوت من الجهاز (يمكن اختيار عدة صور)</span>
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
              <span>إضافة رابط</span>
            </Button>
          </div>
        </div>

        {/* Screenshots Grid / Preview */}
        {screenshots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {screenshots.map((item, i) => (
              <div
                key={i}
                className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-2 shadow-2xs"
              >
                <Image
                  src={item.url}
                  alt={item.name || `معاينة ${i + 1}`}
                  fill
                  sizes="180px"
                  className="object-cover"
                  unoptimized={item.url.startsWith("data:")}
                />
                <button
                  type="button"
                  onClick={() => removeScreenshot(i)}
                  className="absolute top-1.5 end-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition-opacity hover:bg-red-700"
                  aria-label="حذف الصورة"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-black/75 px-2 py-1 text-[10px] font-medium text-white truncate backdrop-blur-xs">
                  {item.name || `صورة ${i + 1}`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted">
            لم يتم رفع أي سكرين شوت للتعريب بعد. اضغط على الزر الأزرق أعلاه لاختيار صورة أو عدة صور من جهازك مباشرة.
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

      <FieldError>
        {state.ok
          ? null
          : state.error
          ? state.error === "forbidden"
            ? "غير مسموح: ليس لديك صلاحية مدير أو محرر، أو انتهت جلستك. يرجى تسجيل الدخول مجددًا كمدير."
            : state.error === "required"
            ? "يرجى ملء جميع الحقول المطلوبة (اسم اللعبة بالعربية والإنجليزية)."
            : state.error === "unknown"
            ? tc("error")
            : state.error
          : null}
      </FieldError>

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