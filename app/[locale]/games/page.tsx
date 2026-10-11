import { getTranslations, setRequestLocale } from "next-intl/server";
import { GameGrid, Pagination } from "@/components/games/game-grid";
import { GamesToolbar } from "@/components/games/games-toolbar";
import { Container } from "@/components/ui/container";
import { getGames } from "@/lib/queries";
import { alternates } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("gamesTitle"),
    description: t("gamesDescription"),
    alternates: alternates(locale, "/games"),
  };
}

export default async function GamesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("games");
  const tc = await getTranslations("common");

  const q = typeof sp.q === "string" ? sp.q : "";
  const sort = sp.sort === "downloads" ? "downloads" : "newest";
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const { games, total, pageCount } = await getGames({
    q,
    sort,
    page,
    perPage: 12,
  });

  const query: Record<string, string | undefined> = {};
  if (q) query.q = q;
  if (sort !== "newest") query.sort = sort;

  return (
    <Container className="py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </header>

      <div className="mb-6">
        <GamesToolbar initialQ={q} initialSort={sort} />
      </div>

      <p className="mb-6 text-sm text-muted" aria-live="polite">
        {tc("results")}:{" "}
        <span className="tabular font-medium text-foreground">
          {formatNumber(total, locale)}
        </span>
      </p>

      <GameGrid games={games} locale={locale} />
      <Pagination page={page} pageCount={pageCount} query={query} />
    </Container>
  );
}