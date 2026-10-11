"use client";

import { Trash2, Upload } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState(saveGameAction, {
    ...initialFormState,
  });
  const [coverUrl, setCoverUrl] = useState(game?.cover_url ?? "");
  const [uploading, setUploading] = useState(false);

  const uploadCover = async (file: File) => {
    setUploading(true);
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
      setUploading(false);
    }
  };

  const successLabel =
    state.message === "updated"
      ? t("updated")
      : state.message === "created"
        ? t("created")
        : null;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="id" value={game?.id ?? ""} />
      {live ? <input type="hidden" name="published" value="on" /> : null}
      <input type="hidden" name="cover_url" value={coverUrl} />

      {/* Cover */}
      <div>
        <Label>{t("cover")}</Label>
        <div className="flex items-start gap-4">
          <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-2 sm:w-32">
            {coverUrl ? (
              <>
                <Image
                  src={coverUrl}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
                <button
                  type="button"
                  aria-label={tc("delete")}
                  onClick={() => setCoverUrl("")}
                  className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
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
          <div className="flex-1">
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
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? <Spinner /> : <Upload className="h-4 w-4" />}
              {uploading ? t("coverUploading") : tc("upload")}
            </Button>
            <p className="mt-1.5 text-xs text-muted">{t("coverHint")}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <LangField label={t("titleAr")} name="title_ar" dir="rtl" defaultValue={game?.title_ar} />
        <LangField label={t("titleEn")} name="title_en" dir="ltr" defaultValue={game?.title_en} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="description_ar">{t("descriptionAr")}</Label>
          <Textarea name="description_ar" id="description_ar" dir="rtl" defaultValue={game?.description_ar ?? ""} />
        </div>
        <div>
          <Label htmlFor="description_en">{t("descriptionEn")}</Label>
          <Textarea name="description_en" id="description_en" dir="ltr" defaultValue={game?.description_en ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug">
            {t("slug")} <span className="font-normal text-muted">({tc("optional")})</span>
          </Label>
          <Input id="slug" name="slug" dir="ltr" className="text-left" placeholder={game?.slug ?? ""} defaultValue={game?.slug ?? ""} />
          <p className="mt-1.5 text-xs text-muted">{t("slugHint")}</p>
        </div>
        <div>
          <Label htmlFor="steam_url">
            {t("steamUrl")} <span className="font-normal text-muted">({tc("optional")})</span>
          </Label>
          <Input id="steam_url" name="steam_url" type="url" dir="ltr" className="text-left" defaultValue={game?.steam_url ?? ""} />
        </div>
      </div>

      {!live ? (
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox
            name="published"
            defaultChecked={!game ? true : game.published}
          />
          <span>
            {t("published")}
            <span className="block text-xs font-normal text-muted">
              {t("publishedHint")}
            </span>
          </span>
        </label>
      ) : null}

      <FieldError>{state.error ? tc("error") : null}</FieldError>
      {successLabel ? (
        <p className="rounded-[var(--radius-control)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-3.5 py-2.5 text-sm text-success">
          {successLabel}
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : null}
          {game ? tc("save") : tc("create")}
        </Button>
        {game ? (
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/games")}>
            {tc("cancel")}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function LangField({
  label,
  name,
  dir,
  defaultValue,
}: {
  label: string;
  name: string;
  dir: "rtl" | "ltr";
  defaultValue?: string | null;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required dir={dir} defaultValue={defaultValue ?? ""} />
    </div>
  );
}