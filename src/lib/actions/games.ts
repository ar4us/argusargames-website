import { getGames } from "@/lib/queries";
import type { GameWithLatest } from "@/lib/types";

export async function fetchMoreGamesAction(
  page: number,
  perPage = 8,
): Promise<{ games: GameWithLatest[]; hasMore: boolean; total: number }> {
  const result = await getGames({ page, perPage, sort: "newest" });
  return {
    games: result.games,
    hasMore: page < result.pageCount,
    total: result.total,
  };
}
