"use client";

import { Search, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export function HeroSearch() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = value.trim() ? { q: value.trim() } : undefined;
    router.push({ pathname: "/games", query });
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      className="group relative flex w-full items-center gap-2 rounded-2xl border border-border bg-surface/90 p-2 ps-4 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-200 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15"
    >
      <Search className="h-5 w-5 shrink-0 text-muted transition-colors group-focus-within:text-accent" aria-hidden />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tc("searchPlaceholder")}
        aria-label={tc("search")}
        className="h-10 min-w-0 flex-1 bg-transparent text-sm sm:text-base text-foreground outline-none placeholder:text-muted"
      />
      <Button type="submit" size="md" className="rounded-xl px-5 font-bold shadow-md shadow-accent/20">
        <span>{t("searchCta")}</span>
      </Button>
    </form>
  );
}
