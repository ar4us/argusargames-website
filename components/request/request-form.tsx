"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import {
  createRequestAction,
} from "@/lib/actions/requests";
import { initialFormState } from "@/lib/action-types";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { Link } from "@/i18n/navigation";

export function RequestForm() {
  const t = useTranslations("request");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    createRequestAction,
    initialFormState,
  );

  const errorMessage = () => {
    switch (state.error) {
      case "required":
        return tc("required");
      case "duplicate":
        return t("alreadyRequested");
      case "auth":
        return t("loginRequired");
      default:
        return state.error ? tc("error") : null;
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <div>
        <Label htmlFor="game_name">{t("gameName")}</Label>
        <Input
          id="game_name"
          name="game_name"
          required
          placeholder={t("gameNamePlaceholder")}
        />
      </div>
      <div>
        <Label htmlFor="game_url">
          {t("gameUrl")}{" "}
          <span className="text-muted">({tc("optional")})</span>
        </Label>
        <Input
          id="game_url"
          name="game_url"
          type="url"
          dir="ltr"
          className="text-left"
          placeholder={t("gameUrlPlaceholder")}
        />
      </div>
      <div>
        <Label htmlFor="notes">
          {t("notes")}{" "}
          <span className="text-muted">({tc("optional")})</span>
        </Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder={t("notesPlaceholder")}
        />
      </div>

      {state.ok ? (
        <p className="rounded-[var(--radius-control)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-3.5 py-2.5 text-sm text-success">
          {t("submitted")}
        </p>
      ) : (
        <>
          <FieldError>{errorMessage()}</FieldError>
          {state.error === "auth" ? (
            <p>
              <Link
                href="/login"
                className="text-sm font-medium text-accent hover:underline"
              >
                {t("loginCta")}
              </Link>
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? <Spinner /> : null}
            {t("submit")}
          </Button>
        </>
      )}
    </form>
  );
}