import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GameCard } from "@/components/games/game-card";
import { EmptyState } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { GameWithLatest } from "@/lib/types";

export async function GameGrid({
  games,
  locale,
}: {
  games: GameWithLatest[];
  locale: string;
}) {
  const t = await getTranslations("games");
  if (games.length === 0) {
    return (
      <EmptyState
        title={t("empty")}
        action={
          <Link
            href="/request"
            className="text-sm font-medium text-accent hover:underline"
          >
            {t("emptyCta")}
          </Link>
        }
      />
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} locale={locale} />
      ))}
    </div>
  );
}

export async function Pagination({
  page,
  pageCount,
  query,
}: {
  page: number;
  pageCount: number;
  query: Record<string, string | undefined>;
}) {
  const t = await getTranslations("common");
  if (pageCount <= 1) return null;

  const build = (p: number) => ({ pathname: "/games" as const, query: { ...query, page: String(p) } });

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-3"
      aria-label="pagination"
    >
      {page > 1 ? (
        <Link
          href={build(page - 1)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-2"
        >
          <ChevronRight className="h-4 w-4 rtl:hidden" />
          <ChevronLeft className="hidden h-4 w-4 rtl:block" />
          {t("previous")}
        </Link>
      ) : null}

      <span className="tabular text-sm text-muted">
        {t("page")} {page} {t("of")} {pageCount}
      </span>

      {page < pageCount ? (
        <Link
          href={build(page + 1)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-2"
        >
          {t("next")}
          <ChevronLeft className="h-4 w-4 rtl:hidden" />
          <ChevronRight className="hidden h-4 w-4 rtl:block" />
        </Link>
      ) : null}
    </nav>
  );
}
