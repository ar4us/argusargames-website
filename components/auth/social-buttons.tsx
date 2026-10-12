"use client";

import { FaGoogle } from "react-icons/fa6";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Spinner } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SocialButtons() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [loading, setLoading] = useState<"google" | null>(null);

  const signIn = async (provider: "google") => {
    setLoading(provider);
    try {
      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const nextParam = params.get("redirectTo") || `/${locale}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`,
        },
      });
      if (error) {
        setLoading(null);
        console.error("OAuth error", error.message);
      }
      // On success the browser navigates away to the provider.
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="w-full">
      <Button
        type="button"
        variant="outline"
        onClick={() => signIn("google")}
        disabled={loading !== null}
        className="w-full gap-2.5 h-11 font-medium"
      >
        {loading === "google" ? <Spinner /> : <FaGoogle className="h-4 w-4" />}
        <span>{t("google")}</span>
      </Button>
    </div>
  );
}