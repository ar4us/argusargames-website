"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { updateSettingsAction } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/action-types";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import type { SiteSettings } from "@/lib/types";

const SOCIALS = [
  { key: "social_facebook", labelKey: "facebook" },
  { key: "social_twitter", labelKey: "twitter" },
  { key: "social_reddit", labelKey: "reddit" },
  { key: "social_discord", labelKey: "discord" },
  { key: "social_telegram", labelKey: "telegram" },
] as const;

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("admin.settings");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    updateSettingsAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="site_name_ar">{t("siteNameAr")}</Label>
          <Input
            id="site_name_ar"
            name="site_name_ar"
            dir="rtl"
            defaultValue={settings.site_name_ar}
            required
          />
        </div>
        <div>
          <Label htmlFor="site_name_en">{t("siteNameEn")}</Label>
          <Input
            id="site_name_en"
            name="site_name_en"
            dir="ltr"
            className="text-left"
            defaultValue={settings.site_name_en}
            required
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">
          {t("social")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIALS.map(({ key, labelKey }) => (
            <div key={key}>
              <Label htmlFor={key}>{t(labelKey)}</Label>
              <Input
                id={key}
                name={key}
                type="url"
                dir="ltr"
                className="text-left"
                defaultValue={
                  (settings[key] as string | null) ?? ""
                }
                placeholder="https://…"
              />
            </div>
          ))}
        </div>
      </fieldset>

      <FieldError>{state.error ? tc("error") : null}</FieldError>
      {state.ok ? (
        <p className="rounded-[var(--radius-control)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-3.5 py-2.5 text-sm text-success">
          {t("saved")}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? <Spinner /> : null}
        {tc("save")}
      </Button>
    </form>
  );
}