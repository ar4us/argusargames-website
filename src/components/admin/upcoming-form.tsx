"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useActionState } from "react";
import { Upload, Trash2, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { saveUpcomingGameAction } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/action-types";
import type { UpcomingGame } from "@/lib/types";

interface UpcomingGameFormProps {
  game?: UpcomingGame | null;
  locale: string;
}

async function processImageFile(
  file: File,
  maxWidth = 960,
  quality = 0.75,
): Promise<{ url: string; name: string }> {
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
    reader.onerror = () => reject(new Error("فشل قراءة الملف"));
    reader.readAsDataURL(file);
  });
}

export function UpcomingGameForm({ game, locale }: UpcomingGameFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState(game?.cover_url ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(
    saveUpcomingGameAction,
    initialFormState,
  );

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setUploadNotice(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", game?.slug || "upcoming-cover");
      const res = await fetch("/api/admin/upload-cover", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        setCoverUrl(data.url);
        setUploadNotice("تم رفع غلاف المشروع بنجاح!");
      } else {
        const processed = await processImageFile(file, 960, 0.75);
        setCoverUrl(processed.url);
        setUploadNotice("تم تجهيز غلاف المشروع بنجاح!");
      }
    } catch {
      const processed = await processImageFile(file, 960, 0.75);
      setCoverUrl(processed.url);
      setUploadNotice("تم تجهيز غلاف المشروع بنجاح!");
    } finally {
      setUploadingCover(false);
      setTimeout(() => setUploadNotice(null), 4000);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      {game?.id && <input type="hidden" name="id" value={game.id} />}
      <input type="hidden" name="cover_url" value={coverUrl} />

      {uploadNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* Title fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="title_ar">اسم اللعبة بالعربية *</Label>
          <Input
            id="title_ar"
            name="title_ar"
            defaultValue={game?.title_ar ?? ""}
            required
            placeholder="مثال: الأب المجنون / سايلنت هيل: تاونفول"
          />
        </div>

        <div>
          <Label htmlFor="title_en">English Title *</Label>
          <Input
            id="title_en"
            name="title_en"
            defaultValue={game?.title_en ?? ""}
            required
            dir="ltr"
            placeholder="e.g. Mad Father / Silent Hill: Townfall"
          />
        </div>
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug">الرابط المخصص (Slug)</Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={game?.slug ?? ""}
          dir="ltr"
          placeholder="mad-father"
        />
        <p className="mt-1 text-xs text-muted">اتركه فارغاً للتوليد التلقائي من الاسم الإنجليزي</p>
      </div>

      {/* Cover Upload Box (Computer upload + URL input) */}
      <div className="rounded-2xl border border-border bg-surface-2/40 p-4 sm:p-5">
        <Label className="text-sm font-bold text-foreground mb-3 block">
          غلاف اللعبة (Cover Image)
        </Label>
        
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Cover Preview */}
          <div className="relative aspect-[16/9] w-full sm:w-48 shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
            {coverUrl ? (
              <>
                <Image
                  src={coverUrl}
                  alt="الغلاف"
                  fill
                  sizes="192px"
                  className="object-cover"
                  unoptimized={coverUrl.startsWith("data:")}
                />
                <button
                  type="button"
                  title="حذف الصورة"
                  onClick={() => setCoverUrl("")}
                  className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black/90 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-muted gap-1">
                <ImageIcon className="h-7 w-7 opacity-30" />
                <span className="text-[11px]">معاينة الغلاف</span>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3 w-full">
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

            <div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploadingCover}
                onClick={() => fileRef.current?.click()}
                className="gap-2"
              >
                {uploadingCover ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
                <span>
                  {uploadingCover ? "جاري رفع الغلاف..." : "رفع صورة من جهازك"}
                </span>
              </Button>
              <p className="mt-1 text-xs text-muted">
                الصيغ المدعومة: PNG, JPG, WebP بنسبة 16:9
              </p>
            </div>

            <div className="pt-1">
              <Label htmlFor="cover_url_input" className="text-xs text-muted">
                أو الصق رابط صورة خارجي مباشرة:
              </Label>
              <Input
                id="cover_url_input"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                dir="ltr"
                className="mt-1 text-xs"
                placeholder="https://... أو /covers/game.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Status */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <Label htmlFor="progress_percentage">نسبة الإنجاز (0 - 100%)</Label>
          <div className="mt-1 flex items-center gap-3">
            <Input
              id="progress_percentage"
              name="progress_percentage"
              type="number"
              min={0}
              max={100}
              defaultValue={game?.progress_percentage ?? 0}
              className="w-24 tabular"
            />
            <span className="text-sm font-bold text-muted">%</span>
          </div>
        </div>

        <div>
          <Label htmlFor="status">حالة المشروع</Label>
          <select
            id="status"
            name="status"
            defaultValue={game?.status ?? "قيد التعريب"}
            className="mt-1 block w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-hidden"
          >
            <option value="قيد التعريب">قيد التعريب</option>
            <option value="قيد التدقيق والتجربة">قيد التدقيق والتجربة</option>
            <option value="قيد استخراج النصوص">قيد استخراج النصوص</option>
            <option value="قيد البرمجة">قيد البرمجة</option>
            <option value="قريباً">قريباً</option>
            <option value="مكتمل">مكتمل</option>
          </select>
        </div>

        <div>
          <Label htmlFor="expected_date">الموعد المتوقع للصدور</Label>
          <Input
            id="expected_date"
            name="expected_date"
            defaultValue={game?.expected_date ?? ""}
            placeholder="مثال: قريباً / الربع الأخير 2026"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="platforms">المنصات المدعومة</Label>
        <Input
          id="platforms"
          name="platforms"
          defaultValue={game?.platforms ?? "PC"}
          placeholder="مثال: PC أو PC / PS5"
        />
      </div>

      <div>
        <Label htmlFor="description">نبذة أو معلومات إضافية عن المشروع</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={game?.description ?? ""}
          rows={4}
          placeholder="تفاصيل حول حالة المشروع، هل تم الانتهاء من نصوص القصة، حالة الخط العربي، إلخ..."
        />
      </div>

      {state.error ? <FieldError>{state.error}</FieldError> : null}
      {state.ok ? (
        <p className="rounded-[var(--radius-control)] bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          تم حفظ مشروع التعريب القادم بنجاح!
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : null}
          {game?.id ? "تحديث المشروع" : "إضافة المشروع القادم"}
        </Button>
        <Link
          href="/admin/upcoming"
          className="rounded-[var(--radius-control)] px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          إلغاء
        </Link>
      </div>
    </form>
  );
}
