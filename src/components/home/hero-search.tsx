"use client";

import { Search } from "lucide-react";
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
    const term = value.trim();
    if (term) {
      router.push({ pathname: "/games", query: { q: term } });
    } else {
      router.push("/games");
    }
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      className="group flex w-full items-center gap-2 rounded-2xl border border-border bg-surface p-1.5 ps-4 shadow-sm transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
    >
      <Search className="h-4 w-4 shrink-0 text-muted" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tc("searchPlaceholder")}
        aria-label={tc("search")}
        className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
      />
      <Button
        type="submit"
        size="md"
        className="rounded-xl px-5 text-sm font-semibold"
      >
        <span>{t("searchCta")}</span>
      </Button>
    </form>
  );
}
