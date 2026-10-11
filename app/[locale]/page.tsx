import { ArrowRight, Download, Flame, Sparkles, Gamepad2, Layers, CheckCircle } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GameCard } from "@/components/games/game-card";
import { HeroSearch } from "@/components/home/hero-search";
import { LogoMark } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getLatestGames, getMostDownloaded, getStats } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { alternates } from "@/lib/seo";
import { formatNumber, getLocalized } from "@/lib/utils";
import type { GameWithLatest } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: alternates(locale),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const [latest, popular, stats] = await Promise.all([
    getLatestGames(4),
    getMostDownloaded(5),
    getStats(),
  ]);

  return (
    <>
      {/* Cinematic Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface/50 via-background to-background">
        {/* Subtle Ambient Radial Backlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[450px] w-[900px] max-w-full rounded-full opacity-20 blur-[120px] [background-image:radial-gradient(circle_at_center,var(--accent),transparent_70%)]"
        />

        <Container className="relative py-16 sm:py-24 lg:py-28 text-center sm:text-start">
          <div className="max-w-3xl">
            {/* Pill Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-3.5 py-1 text-xs font-semibold text-accent mb-6 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("latest")} &bull; تحديثات وتنزيل مباشر فائق السرعة</span>
            </div>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
              {t("heroSubtitle")}
            </p>
          </div>

          {/* Hero Search Box */}
          <div className="mt-8 max-w-2xl">
            <HeroSearch />
          </div>

          {/* Stats Cards Row */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-3xl">
            <div className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-md shadow-sm transition-all hover:border-accent/30">
              <span className="block text-2xl font-extrabold tracking-tight text-foreground tabular">
                {formatNumber(stats.games, locale)}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-muted">
                {t("statsGames")}
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-md shadow-sm transition-all hover:border-accent/30">
              <span className="block text-2xl font-extrabold tracking-tight text-foreground tabular">
                {formatNumber(stats.versions, locale)}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-muted">
                {t("statsVersions")}
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-md shadow-sm transition-all hover:border-accent/30">
              <span className="block text-2xl font-extrabold tracking-tight text-accent tabular">
                {formatNumber(stats.downloads, locale)}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-muted">
                {t("statsDownloads")}
              </span>
            </div>

            <Link
              href="/games"
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-md shadow-sm transition-all hover:border-accent hover:bg-accent-soft"
            >
              <div className="flex items-center justify-between">
                <Gamepad2 className="h-5 w-5 text-accent" />
                <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
              </div>
              <span className="mt-2 text-xs font-bold text-foreground group-hover:text-accent">
                {t("browseAll")} &larr;
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {!isSupabaseConfigured() ? (
        <Container className="pt-6">
          <div className="rounded-[var(--radius-card)] border border-warning/40 bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm">
            <span className="font-semibold text-warning">Setup — </span>
            {tc("error")} Supabase. See README.
          </div>
        </Container>
      ) : null}

      {/* Latest Localizations Grid */}
      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {t("latest")}
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted">أحدث تعريبات الألعاب التي تم إطلاقها أو تحديثها حديثاً</p>
            </div>

            <Link
              href="/games"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              {tc("viewAll")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          {latest.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {latest.map((game) => (
                <GameCard key={game.id} game={game} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<LogoMark className="h-8 w-8" />}
              title={tc("empty")}
              description="لم يتم نشر أي ألعاب بعد. يمكنك طلب تعريب لعبتك المفضلة الآن!"
              action={
                <Link
                  href="/request"
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  {t("requestCta")}
                </Link>
              }
            />
          )}
        </Container>
      </section>

      {/* Most Downloaded Games Ranked List */}
      {popular.length > 0 ? (
        <section className="pb-16">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <Flame className="h-4 w-4" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {t("mostDownloaded")}
                  </h2>
                </div>
                <p className="mt-1 text-sm text-muted">التعريبات الأكثر شعبية وتحميلاً من قبل اللاعبين</p>
              </div>

              <Link
                href={{ pathname: "/games", query: { sort: "downloads" } }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                {tc("viewAll")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            <ol className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm divide-y divide-border/60">
              {popular.map((game, index) => (
                <PopularRow
                  key={game.id}
                  game={game}
                  index={index}
                  locale={locale}
                />
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {/* Request Band CTA */}
      <section className="pb-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-surface to-surface p-8 sm:p-12 shadow-md">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent mb-4">
                صوت المجتمع
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {t("requestTitle")}
              </h2>
              <p className="mt-3 text-base text-muted leading-relaxed">
                {t("requestText")}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/request"
                  className={`${buttonVariants({ size: "lg" })} rounded-xl font-bold`}
                >
                  {t("requestCta")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

async function PopularRow({
  game,
  index,
  locale,
}: {
  game: GameWithLatest;
  index: number;
  locale: string;
}) {
  const title = getLocalized(game, "title", locale);
  const t = await getTranslations("game");

  const rankBadgeColors = [
    "bg-amber-500 text-black shadow-md shadow-amber-500/20", // 1st Gold
    "bg-slate-300 text-black shadow-md shadow-slate-300/20", // 2nd Silver
    "bg-amber-700 text-white shadow-md shadow-amber-700/20", // 3rd Bronze
  ];

  return (
    <li>
      <Link
        href={`/games/${game.slug}`}
        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
      >
        <span
          className={`tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            index < 3 ? rankBadgeColors[index] : "bg-surface-2 text-muted"
          }`}
        >
          {index + 1}
        </span>

        <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2 shadow-sm">
          {game.cover_url ? (
            <Image
              src={game.cover_url}
              alt=""
              fill
              sizes="40px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <LogoMark className="absolute inset-0 m-auto h-5 w-5 opacity-40" />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold text-foreground group-hover:text-accent transition-colors">
            {title}
          </span>
          <span className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted font-mono">{game.title_en}</span>
            {game.latest_version ? (
              <span className="tabular text-[11px] font-semibold text-accent bg-accent-soft px-1.5 py-0.2 rounded">
                v{game.latest_version}
              </span>
            ) : null}
          </span>
        </span>

        <span className="tabular inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted group-hover:border-accent/40 group-hover:text-accent transition-colors">
          <Download className="h-3.5 w-3.5 text-accent" />
          <span>{formatNumber(game.download_count ?? 0, locale)}</span>
          <span className="hidden sm:inline font-normal">{t("downloads")}</span>
        </span>
      </Link>
    </li>
  );
}
