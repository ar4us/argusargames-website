"use client";

import { FaDiscord, FaGoogle } from "react-icons/fa6";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Spinner } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SocialButtons() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [loading, setLoading] = useState<"google" | "discord" | null>(null);

  const signIn = async (provider: "google" | "discord") => {
    setLoading(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/${locale}`,
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

  const options = [
    { id: "google" as const, label: t("google"), Icon: FaGoogle },
    { id: "discord" as const, label: t("discord"), Icon: FaDiscord },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ id, label, Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          onClick={() => signIn(id)}
          disabled={loading !== null}
        >
          {loading === id ? <Spinner /> : <Icon className="h-4 w-4" />}
          {label}
        </Button>
      ))}
    </div>
  );
}