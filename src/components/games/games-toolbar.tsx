"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Input, Select } from "@/components/ui/field";
import { useRouter } from "@/i18n/navigation";

export function GamesToolbar({
  initialQ,
  initialSort,
}: {
  initialQ: string;
  initialSort: "newest" | "downloads";
}) {
  const t = useTranslations("games");
  const tc = useTranslations("common");
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState<"newest" | "downloads">(initialSort);
  const firstRun = useRef(true);

  const apply = (nextQ: string, nextSort: string) => {
    const query: Record<string, string> = {};
    if (nextQ.trim()) query.q = nextQ.trim();
    if (nextSort && nextSort !== "newest") query.sort = nextSort;
    router.replace({ pathname: "/games", query });
  };

  // Debounced search.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const id = setTimeout(() => apply(q, sort), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tc("searchPlaceholder")}
          aria-label={tc("search")}
          className="ps-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap text-sm text-muted">
          {tc("sortBy")}
        </span>
        <Select
          value={sort}
          onChange={(e) => {
            const next = e.target.value as "newest" | "downloads";
            setSort(next);
            apply(q, next);
          }}
          aria-label={tc("sortBy")}
          className="w-44"
        >
          <option value="newest">{tc("newest")}</option>
          <option value="downloads">{tc("topDownloads")}</option>
        </Select>
      </div>
    </div>
  );
}
