"use client";

import { Search, Terminal } from "lucide-react";
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
      className="group relative flex w-full items-center gap-2 rounded-2xl border border-[#1a3d24] bg-[#050c07]/90 p-2 ps-4 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300 focus-within:border-[#00ff66] focus-within:ring-2 focus-within:ring-[#00ff66]/30 focus-within:shadow-[0_0_25px_rgba(0,255,102,0.2)]"
    >
      <div className="flex items-center gap-1.5 text-[#00ff66]">
        <Terminal className="h-4 w-4 shrink-0 opacity-80" />
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tc("searchPlaceholder")}
        aria-label={tc("search")}
        className="h-11 min-w-0 flex-1 bg-transparent text-sm sm:text-base text-[#e5fbf0] outline-none placeholder:text-[#557a62]"
      />
      <Button
        type="submit"
        size="md"
        className="rounded-xl px-6 font-bold shadow-md shadow-[#00ff66]/20 bg-[#00ff66] text-[#020703] hover:bg-[#22ff77] hover:shadow-[#00ff66]/40"
      >
        <Search className="h-4 w-4 rtl:ml-1 ltr:mr-1" />
        <span>{t("searchCta")}</span>
      </Button>
    </form>
  );
}
