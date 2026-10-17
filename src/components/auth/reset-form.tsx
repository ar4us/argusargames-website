"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type State = "loading" | "ready" | "expired" | "success";

export function ResetForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();
  const [state, setState] = useState<State>("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setState(user ? "ready" : "expired");
      } catch {
        setState("expired");
      }
    };
    check();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(
          error.code === "weak_password"
            ? t("errors.weakPassword")
            : t("errors.unknown"),
        );
        setSaving(false);
        return;
      }
      setState("success");
      setSaving(false);
    } catch {
      setError(t("errors.unknown"));
      setSaving(false);
    }
  };

  if (state === "loading") {
    return (
      <p className="flex items-center justify-center gap-2 text-sm text-muted">
        <Spinner /> {tc("loading")}
      </p>
    );
  }

  if (state === "expired") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">{t("errors.unknown")}</p>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-accent hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="space-y-4">
        <p className="rounded-[var(--radius-control)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-3.5 py-2.5 text-sm text-success">
          {t("passwordUpdated")}
        </p>
        <Button
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          className="w-full"
        >
          {t("login")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <FieldError>{error}</FieldError>
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? <Spinner /> : null}
        {t("updatePassword")}
      </Button>
    </form>
  );
}