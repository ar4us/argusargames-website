"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X, Gamepad2 } from "lucide-react";
import { GameCard } from "@/components/games/game-card";
import { Input, Select } from "@/components/ui/field";
import type { GameWithLatest } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { sanitizeGames } from "@/lib/queries";

interface GamesExplorerProps {
  initialGames: GameWithLatest[];
  locale: string;
}

export function GamesExplorer({ initialGames, locale }: GamesExplorerProps) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "downloads">("newest");
  const [games, setGames] = useState<GameWithLatest[]>(() =>
    initialGames.filter((g) => g.published !== false)
  );
  const isAr = locale === "ar";

  // Live query from Supabase to ensure any admin changes reflect immediately
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase
        .from("games_with_latest")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setGames(sanitizeGames(data as GameWithLatest[]));
          }
        });
    } catch {}
  }, []);

  // Read initial query params from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlQ = params.get("q");
      const urlSort = params.get("sort");
      if (urlQ) setQ(urlQ);
      if (urlSort === "downloads" || urlSort === "newest") {
        setSort(urlSort);
      }
    }
  }, []);

  // Sync state to URL without reloading
  const updateUrl = (nextQ: string, nextSort: "newest" | "downloads") => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (nextQ.trim()) {
      url.searchParams.set("q", nextQ.trim());
    } else {
      url.searchParams.delete("q");
    }
    if (nextSort === "downloads") {
      url.searchParams.set("sort", "downloads");
    } else {
      url.searchParams.delete("sort");
    }
    window.history.replaceState({}, "", url.toString());
  };

  const handleSearchChange = (val: string) => {
    setQ(val);
    updateUrl(val, sort);
  };

  const handleSortChange = (nextSort: "newest" | "downloads") => {
    setSort(nextSort);
    updateUrl(q, nextSort);
  };

  const clearSearch = () => {
    setQ("");
    updateUrl("", sort);
  };

  // Filter and sort games in memory
  const filteredGames = useMemo(() => {
    let list = [...games];
    const term = q.trim().toLowerCase();
    if (term) {
      list = list.filter((g) => {
        const ar = (g.title_ar || "").toLowerCase();
        const en = (g.title_en || "").toLowerCase();
        const slug = (g.slug || "").toLowerCase();
        return ar.includes(term) || en.includes(term) || slug.includes(term);
      });
    }

    if (sort === "downloads") {
      list.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
    } else {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    return list;
  }, [games, q, sort]);

  return (
    <div className="space-y-8">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={
              isAr
                ? "ابحث باسم اللعبة بالعربية أو الإنجليزية..."
                : "Search games by Arabic or English title..."
            }
            aria-label="بحث"
            className="ps-10 pe-9 h-11 rounded-xl bg-surface-2/60 border-border"
          />
          {q && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-0.5 rounded-full"
              aria-label="مسح البحث"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="whitespace-nowrap text-xs font-semibold text-muted">
            {isAr ? "الترتيب حسب:" : "Sort by:"}
          </span>
          <Select
            value={sort}
            onChange={(e) =>
              handleSortChange(e.target.value as "newest" | "downloads")
            }
            aria-label="الترتيب"
            className="w-44 h-11 rounded-xl bg-surface-2/60 border-border text-xs font-semibold"
          >
            <option value="newest">{isAr ? "الأحدث إصداراً" : "Newest"}</option>
            <option value="downloads">
              {isAr ? "الأكثر تحميلاً" : "Most Downloaded"}
            </option>
          </Select>
        </div>
      </div>

      {/* Results Count Counter */}
      <div className="flex items-center justify-between text-sm text-muted">
        <p aria-live="polite">
          {isAr ? "عدد التعريبات المتوفرة:" : "Results:"}{" "}
          <span className="tabular font-bold text-foreground">
            {formatNumber(filteredGames.length, locale)}
          </span>{" "}
          {isAr ? "لعبة" : "games"}
        </p>
      </div>

      {/* Grid or Empty State */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-muted">
            <Gamepad2 className="h-7 w-7 opacity-40" />
          </div>
          <p className="text-base font-bold text-foreground">
            {isAr ? "لم يتم العثور على أي نتائج" : "No results found"}
          </p>
          <p className="mt-1.5 max-w-sm text-sm text-muted">
            {isAr
              ? `لم نجد أي تعريب يطابق "${q}". تأكد من صحة الكلمة أو اطلب تعريبها الآن!`
              : `No localizations matched "${q}".`}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={clearSearch}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
            >
              {isAr ? "عرض جميع الألعاب" : "Show all games"}
            </button>
            <a
              href={`/${locale}/request`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
            >
              {isAr ? "اطلب تعريب اللعبة" : "Request localization"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
