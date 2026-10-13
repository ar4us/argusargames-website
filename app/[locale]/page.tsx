import {
  ArrowRight,
  Download,
  Flame,
  Gamepad2,
  Sparkles,
  Layers,
  Search,
} from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LatestGamesGrid } from "@/components/home/latest-games-grid";
import { UpcomingGamesSection } from "@/components/home/upcoming-games-section";
import { HeroSearch } from "@/components/home/hero-search";
import { LogoMark } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getGames, getMostDownloaded, getStats, getUpcomingGames } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { alternates } from "@/lib/seo";
import { formatNumber, getLocalized } from "@/lib/utils";
import type { GameWithLatest } from "@/lib/types";

export const revalidate = 60;

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

  const [latestRes, popular, stats, upcoming] = await Promise.all([
    getGames({ sort: "newest", perPage: 8, page: 1 }),
    getMostDownloaded(5),
    getStats(),
    getUpcomingGames(),
  ]);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-20">
      {/* =========================================================================
          HERO SECTION — MINIMALIST, HIGH-END & CLEAN (INSPIRED BY MUARRAB & TA3REB)
         ========================================================================= */}
      <section className="relative border-b border-border bg-gradient-to-b from-surface to-background py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            {/* Subtle Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted shadow-xs mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
              <span>مكتبة تعريب ألعاب الفيديو العربية</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
              حمّل تعريبات ألعابك المفضلة{" "}
              <span className="text-blue-600 dark:text-blue-400">باللغة العربية</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
              منصة عربية تقدم لك باتشات تعريب احترافية، شروحات تثبيت خطوة بخطوة، وروابط تحميل مباشرة وسريعة لكافة المنصات.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <HeroSearch />
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-muted">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground tabular">
                  {formatNumber(stats.games, locale)}
                </span>
                <span>{t("statsGames")}</span>
              </div>
              <span className="text-border-strong">•</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground tabular">
                  {formatNumber(stats.versions, locale)}
                </span>
                <span>{t("statsVersions")}</span>
              </div>
              <span className="text-border-strong">•</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground tabular">
                  {formatNumber(stats.downloads, locale)}
                </span>
                <span>{t("statsDownloads")}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {!isSupabaseConfigured() ? (
        <Container>
          <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
            <span className="font-semibold text-warning">Setup — </span>
            {tc("error")} Supabase. See README.
          </div>
        </Container>
      ) : null}

      {/* =========================================================================
          LATEST LOCALIZATIONS DIRECTORY (LOAD MORE BUTTON INCLUDED)
         ========================================================================= */}
      <section>
        <Container>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {t("latest")}
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted">
                أحدث ملفات وباتشات التعريب التي تمت إضافتها وتحديثها
              </p>
            </div>

            <Link
              href="/games"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>{tc("viewAll")}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          {latestRes.games.length > 0 ? (
            <LatestGamesGrid
              initialGames={latestRes.games}
              total={latestRes.total}
              locale={locale}
              perPage={8}
            />
          ) : (
            <EmptyState
              icon={<LogoMark className="h-10 w-10" />}
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

      {/* =========================================================================
          UPCOMING LOCALIZATIONS SECTION (IN-PROGRESS PROJECTS)
         ========================================================================= */}
      <UpcomingGamesSection games={upcoming} locale={locale} />

      {/* =========================================================================
          MOST DOWNLOADED RANKED LIST (CLEAN LIST DESIGN)
         ========================================================================= */}
      {popular.length > 0 ? (
        <section className="pt-6">
          <Container>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {t("mostDownloaded")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  التعريبات الأكثر شعبية وتثبيتاً من قِبل اللاعبين
                </p>
              </div>

              <Link
                href={{ pathname: "/games", query: { sort: "downloads" } }}
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>{tc("viewAll")}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            <ol className="overflow-hidden rounded-2xl border border-border bg-surface divide-y divide-border shadow-xs">
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

      {/* =========================================================================
          REQUEST LOCALIZATION CALLOUT (CLEAN & MINIMAL)
         ========================================================================= */}
      <section className="pt-4">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl border border-border bg-surface-2/60 p-8 sm:p-10">
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                لم تجد تعريب لعبتك المفضلة؟
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                يمكنك إرسال طلب لتعريب أي لعبة تود رؤيتها باللغة العربية، وسيتم مراجعتها والتصويت عليها من قبل المجتمع.
              </p>
            </div>

            <Link
              href="/request"
              className={buttonVariants({ variant: "primary", size: "lg", className: "shrink-0" })}
            >
              <span>{t("requestCta")}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
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

  return (
    <li>
      <Link
        href={`/games/${game.slug}`}
        className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2"
      >
        <span className="tabular font-bold flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-xs text-muted group-hover:bg-foreground group-hover:text-background transition-colors">
          {index + 1}
        </span>

        <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2">
          {game.cover_url ? (
            <Image
              src={game.cover_url}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <Gamepad2 className="absolute inset-0 m-auto h-5 w-5 opacity-30 text-muted" />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </span>
          <span className="flex items-center gap-2 mt-0.5 text-xs text-muted">
            <span>{game.title_en}</span>
            {game.latest_version ? (
              <span className="rounded bg-surface-2 px-1.5 py-0.2 font-mono text-[10px]">
                v{game.latest_version}
              </span>
            ) : null}
          </span>
        </span>

        <span className="tabular inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          <Download className="h-3.5 w-3.5" />
          <span>{formatNumber(game.download_count ?? 0, locale)}</span>
        </span>
      </Link>
    </li>
  );
}
