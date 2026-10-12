"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { saveVersionAction } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/action-types";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";

export function VersionForm({ gameId }: { gameId: string }) {
  const t = useTranslations("admin.versions");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    saveVersionAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="game_id" value={gameId} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="version">رقم الإصدار (Version) *</Label>
          <Input
            id="version"
            name="version"
            dir="ltr"
            className="text-left"
            placeholder="مثال: v1.0 أو v1.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="platform">المنصة المدعومة (Platform)</Label>
          <Input
            id="platform"
            name="platform"
            defaultValue="PC (Windows)"
            placeholder="مثال: PC (Steam / Epic Games)"
            dir="ltr"
          />
        </div>

        <div>
          <Label htmlFor="file_size">حجم الملف (File Size)</Label>
          <Input
            id="file_size"
            name="file_size"
            placeholder="مثال: 18 ميغابايت أو 85 MB"
            dir="rtl"
          />
        </div>

        <div>
          <Label htmlFor="release_date">{t("releaseDate")}</Label>
          <Input id="release_date" name="release_date" type="date" />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="download_url">رابط تحميل الباتش (Download URL) *</Label>
          <Input
            id="download_url"
            name="download_url"
            type="url"
            dir="ltr"
            className="text-left"
            placeholder="https://drive.google.com/... أو رابط مباشر"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes_ar">
          ملاحظات التعريب وطريقة التثبيت <span className="font-normal text-muted">({tc("optional")})</span>
        </Label>
        <Textarea
          id="notes_ar"
          name="notes_ar"
          dir="rtl"
          placeholder="اكتب هنا أي تعليمات لتثبيت هذا الإصدار أو التغييرات المضافة في هذا التحديث..."
          className="min-h-24 leading-relaxed"
        />
      </div>

      <FieldError>{state.ok ? null : state.error ? tc("error") : null}</FieldError>
      {state.ok ? (
        <p className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          تمت إضافة إصدار التعريب بنجاح!
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="min-w-28">
        {pending ? <Spinner /> : null}
        إضافة الإصدار
      </Button>
    </form>
  );
}