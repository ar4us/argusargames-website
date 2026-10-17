"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { GameCard } from "@/components/games/game-card";
import type { GameWithLatest } from "@/lib/types";
import { fetchMoreGamesAction } from "@/lib/actions/games";

interface LatestGamesGridProps {
  initialGames: GameWithLatest[];
  total: number;
  locale: string;
  perPage?: number;
}

export function LatestGamesGrid({
  initialGames,
  total,
  locale,
  perPage = 8,
}: LatestGamesGridProps) {
  const [games, setGames] = useState<GameWithLatest[]>(initialGames);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialGames.length < total);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    const nextPage = page + 1;
    startTransition(async () => {
      try {
        const res = await fetchMoreGamesAction(nextPage, perPage);
        if (res.games.length > 0) {
          setGames((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const fresh = res.games.filter((g) => !existingIds.has(g.id));
            return [...prev, ...fresh];
          });
          setPage(nextPage);
        }
        setHasMore(res.hasMore && (games.length + res.games.length < (res.total || total)));
      } catch (err) {
        console.error("Failed to load more games:", err);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} locale={locale} />
        ))}
      </div>

      {hasMore ? (
        <div className="pt-4 flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isPending}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-8 py-3.5 text-sm font-bold text-foreground shadow-xs hover:border-blue-500/50 hover:bg-surface-2 hover:shadow-md hover:shadow-blue-500/5 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center gap-2 text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span>جاري تحميل التعريبات...</span>
              </span>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:translate-y-0.5 transition-transform" />
                <span>عرض المزيد من التعريبات</span>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-muted tabular">
                  {games.length} من {total}
                </span>
              </>
            )}
          </button>
        </div>
      ) : total > games.length || (total > 8 && games.length === total) ? (
        <div className="pt-2 text-center text-xs text-muted font-medium">
          تم عرض جميع التعريبات المتوفرة في المكتبة ({games.length})
        </div>
      ) : null}
    </div>
  );
}
