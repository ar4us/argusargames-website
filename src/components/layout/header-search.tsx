"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Gamepad2, ArrowRight } from "lucide-react";
import searchIndex from "@/data/search_index.json";
import { useLocale } from "@/lib/i18n-context";

interface GameSearchItem {
  slug: string;
  title_ar: string;
  title_en: string;
  cover_url?: string | null;
}

export function HeaderSearch({
  className,
  isMobile = false,
  onSelect,
}: {
  className?: string;
  isMobile?: boolean;
  onSelect?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isEn = window.location.pathname.startsWith("/en");
      setLocale(isEn ? "en" : "ar");

      // Sync initial query if already on /games?q=...
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get("q");
      if (qParam && window.location.pathname.includes("/games")) {
        setQuery(qParam);
      }
    }
  }, []);

  // Global keyboard shortcut: "/" focuses search
  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        const tagName = target?.tagName?.toLowerCase();
        if (tagName !== "input" && tagName !== "textarea" && !target?.isContentEditable) {
          e.preventDefault();
          inputRef.current?.focus();
          inputRef.current?.select();
          setIsOpen(true);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter games based on query
  const trimmed = query.trim().toLowerCase();
  const results: GameSearchItem[] = trimmed
    ? (searchIndex as GameSearchItem[]).filter(
        (g) =>
          g.published !== false &&
          ((g.title_ar || "").toLowerCase().includes(trimmed) ||
            (g.title_en || "").toLowerCase().includes(trimmed) ||
            (g.slug || "").toLowerCase().includes(trimmed))
      ).slice(0, 6)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeof window === "undefined") return;

    const targetUrl = trimmed
      ? `/${locale}/games?q=${encodeURIComponent(trimmed)}`
      : `/${locale}/games`;

    setIsOpen(false);
    if (onSelect) onSelect();

    // If already on /games page, update search without full reload if possible
    if (window.location.pathname.endsWith("/games")) {
      const url = new URL(window.location.href);
      if (trimmed) {
        url.searchParams.set("q", trimmed);
      } else {
        url.searchParams.delete("q");
      }
      window.history.replaceState({}, "", url.toString());

      // Trigger input in GamesExplorer if on page
      const pageInput = document.querySelector('input[aria-label="بحث"]') as HTMLInputElement;
      if (pageInput) {
        pageInput.value = trimmed;
        pageInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      window.location.href = targetUrl;
    }
  };

  const handleGameClick = (slug: string) => {
    if (typeof window === "undefined") return;
    setIsOpen(false);
    if (onSelect) onSelect();
    window.location.href = `/${locale}/games/${slug}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className || ""}`}
    >
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={
            locale === "ar"
              ? "البحث في التعريبات..."
              : "Search games..."
          }
          className="h-9 w-full rounded-xl border border-border bg-surface-2/50 pe-9 ps-8 text-xs text-foreground placeholder:text-muted focus:border-accent focus:bg-surface focus:outline-hidden focus:ring-1 focus:ring-accent sm:w-56 md:w-64 transition-all duration-200"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground"
            aria-label="مسح البحث"
          >
            <X className="h-3 w-3" />
          </button>
        ) : (
          !isMobile && (
            <kbd className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-muted">
              /
            </kbd>
          )
        )}
      </form>

      {/* Dropdown Live Results */}
      {isOpen && trimmed && (
        <div className="absolute start-0 end-0 top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-xl shadow-black/10 sm:min-w-[300px]">
          {results.length > 0 ? (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                {locale === "ar" ? "التعريبات المطابقة" : "Matching Games"}
              </div>
              {results.map((game) => (
                <button
                  key={game.slug}
                  type="button"
                  onClick={() => handleGameClick(game.slug)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-start transition-colors hover:bg-surface-2"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
                    <Gamepad2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {locale === "ar" ? game.title_ar : game.title_en}
                    </p>
                    <p className="truncate text-[10px] text-muted">
                      {locale === "ar" ? game.title_en : game.title_ar}
                    </p>
                  </div>
                </button>
              ))}
              <div className="border-t border-border mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-accent hover:bg-surface-2"
                >
                  <span>
                    {locale === "ar"
                      ? `عرض كافة النتائج لـ "${trimmed}"`
                      : `View all results for "${trimmed}"`}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-4 text-center">
              <p className="text-xs text-muted">
                {locale === "ar"
                  ? `لا توجد تعريبات تطابق "${trimmed}"`
                  : `No games match "${trimmed}"`}
              </p>
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="mt-2 text-xs text-accent underline hover:text-accent-hover"
              >
                {locale === "ar" ? "الانتقال لصفحة الألعاب" : "Go to all games"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
