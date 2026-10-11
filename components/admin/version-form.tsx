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

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="version">{t("version")}</Label>
          <Input
            id="version"
            name="version"
            dir="ltr"
            className="text-left"
            placeholder={t("versionPlaceholder")}
            required
          />
        </div>
        <div>
          <Label htmlFor="release_date">{t("releaseDate")}</Label>
          <Input id="release_date" name="release_date" type="date" />
        </div>
        <div>
          <Label htmlFor="download_url">{t("downloadUrl")}</Label>
          <Input
            id="download_url"
            name="download_url"
            type="url"
            dir="ltr"
            className="text-left"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="notes_ar">
            {t("notesAr")} <span className="font-normal text-muted">({tc("optional")})</span>
          </Label>
          <Textarea id="notes_ar" name="notes_ar" dir="rtl" className="min-h-24" />
        </div>
        <div>
          <Label htmlFor="notes_en">
            {t("notesEn")} <span className="font-normal text-muted">({tc("optional")})</span>
          </Label>
          <Textarea id="notes_en" name="notes_en" dir="ltr" className="min-h-24 text-left" />
        </div>
      </div>

      <FieldError>{state.ok ? null : state.error ? tc("error") : null}</FieldError>
      {state.ok ? (
        <p className="rounded-[var(--radius-control)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-3.5 py-2.5 text-sm text-success">
          {state.message === "created" ? t("created") : tc("save")}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? <Spinner /> : null}
        {t("add")}
      </Button>
    </form>
  );
}