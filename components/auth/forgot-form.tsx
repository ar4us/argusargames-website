"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

export function ForgotForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/reset-password`,
      });
      if (error) {
        setError(t("errors.unknown"));
        setLoading(false);
        return;
      }
      // Do not reveal whether the account exists.
      setMessage(t("resetSent"));
      setLoading(false);
    } catch {
      setError(t("errors.unknown"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <FieldError>{error}</FieldError>
      {message ? (
        <p className="rounded-[var(--radius-control)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-3.5 py-2.5 text-sm text-success">
          {message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner /> : null}
        {t("sendReset")}
      </Button>
    </form>
  );
}