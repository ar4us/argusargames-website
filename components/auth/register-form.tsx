"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/${locale}`,
        },
      });
      if (error) {
        setError(
          error.code === "email_exists"
            ? t("errors.emailTaken")
            : error.code === "weak_password"
              ? t("errors.weakPassword")
              : t("errors.unknown"),
        );
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push("/");
        router.refresh();
        return;
      }
      setMessage(t("checkEmail"));
      setLoading(false);
    } catch {
      setError(t("errors.unknown"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{t("fullName")}</Label>
        <Input
          id="name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
      <div>
        <Label htmlFor="password">{t("password")}</Label>
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
      {message ? (
        <p className="rounded-[var(--radius-control)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-3.5 py-2.5 text-sm text-success">
          {message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner /> : null}
        {t("register")}
      </Button>
    </form>
  );
}