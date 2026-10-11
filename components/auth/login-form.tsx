"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(
          error.code === "invalid_credentials"
            ? t("errors.invalidCredentials")
            : t("errors.unknown"),
        );
        setLoading(false);
        return;
      }
      window.location.href = `/${window.location.pathname.split("/")[1] || "ar"}`;
    } catch {
      setError(t("errors.unknown"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="mb-1.5">
          {t("email")}
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label className="mb-0">{t("password")}</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-accent hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <FieldError>{error}</FieldError>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner /> : null}
        {t("login")}
      </Button>
    </form>
  );
}