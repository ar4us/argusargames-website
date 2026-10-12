import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  Gamepad2,
  Download,
  Building2,
  Layers,
  ArrowDown,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getGameBySlug, getGameVersions } from "@/lib/queries";
import { alternates, absoluteUrl } from "@/lib/seo";
import { formatNumber, getLocalized } from "@/lib/utils";
import { getGameExtra } from "@/lib/game-details";
import { GameOverviewSpec } from "@/components/games/game-overview-spec";
import { GameScreenshots } from "@/components/games/game-screenshots";
import { getUser } from "@/lib/auth";
import { DownloadSection } from "@/components/games/download-section";
import { SupportWidget } from "@/components/games/support-widget";
import { UpdatesTracker } from "@/components/games/updates-tracker";
import { CommunityRequest } from "@/components/games/community-request";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return {};
  const title = `تعريب ${getLocalized(game, "title", locale)} - ArgusArGames`;
  const description =
    getLocalized(game, "description", locale) ||
    `تحميل باتش تعريب ${game.title_ar} (${game.title_en}) للكمبيوتر مجاناً بروابط مباشرة.`;
  return {
    title,
    description,
    alternates: alternates(locale, `/games/${slug}`),
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/${locale}/games/${slug}`),
      images: game.cover_url ? [game.cover_url] : undefined,
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("game");
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const versions = await getGameVersions(game.id);
  const user = await getUser();
  const title = getLocalized(game, "title", locale);
  const extra = getGameExtra(game.slug, game.description_en);

  return (
    <div className="pb-20">
      {/* =========================================================================
          HERO & GAME INTRO (INSPIRED BY ARABICHESHAM.COM)
         ========================================================================= */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-background to-background py-10 sm:py-16">
        {/* Ambient Blurred Backdrop */}
        {game.cover_url && (
          <div className="pointer-events-none absolute inset-0 -top-40 overflow-hidden opacity-15 blur-3xl">
            <Image
              src={game.cover_url}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <Container className="relative">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-xs sm:text-sm text-muted">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              الرئيسية
            </Link>
            <span aria-hidden>›</span>
            <Link href="/games" className="hover:text-blue-600 transition-colors">
              مكتبة التعريبات
            </Link>
            <span aria-hidden>›</span>
            <span className="truncate text-foreground font-semibold">
              تعريب {title}
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-12 items-start">
            {/* Game Cover */}
            <div className="group relative aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-2xl shadow-black/10">
              {game.cover_url ? (
                <Image
                  src={game.cover_url}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 380px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-2 text-muted">
                  <Gamepad2 className="h-16 w-16 opacity-30" />
                </div>
              )}
              <div className="absolute top-3 start-3">
                <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  {extra.status}
                </span>
              </div>
            </div>

            {/* Game Header Details */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  تعريب رسمي ومجاني
                </span>
                <h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.2]">
                  تعريب {title}
                </h1>
                <p className="mt-1 text-base sm:text-lg text-muted font-medium" dir="ltr">
                  {game.title_en}
                </p>

                {/* Metadata Badges */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <div className="rounded-lg border border-border bg-surface px-3 py-1.5 font-semibold text-foreground flex items-center gap-1.5 shadow-2xs">
                    <CalendarDays className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>تاريخ الصدور: {extra.year}</span>
                  </div>

                  <div className="rounded-lg border border-border bg-surface px-3 py-1.5 font-semibold text-foreground flex items-center gap-1.5 shadow-2xs">
                    <Gamepad2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>المنصات: {extra.platforms || "PC"}</span>
                  </div>

                  <div className="rounded-lg border border-border bg-surface px-3 py-1.5 font-semibold text-foreground flex items-center gap-1.5 shadow-2xs">
                    <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>المطور: {extra.developer}</span>
                  </div>

                  <div className="rounded-lg border border-border bg-surface px-3 py-1.5 font-semibold text-foreground flex items-center gap-1.5 shadow-2xs">
                    <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>النوع: {extra.genre}</span>
                  </div>

                  {(extra.officialUrl || game.steam_url || extra.steamUrl) ? (
                    <a
                      href={extra.officialUrl || game.steam_url || extra.steamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:border-blue-500/40 flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>الموقع الرسمي / Steam</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Jump to download button */}
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-4">
                <a
                  href="#download-section"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition-all duration-200 hover:scale-[1.02]"
                >
                  <Download className="h-4 w-4" />
                  <span>الانتقال إلى رابط التحميل</span>
                  <ArrowDown className="h-4 w-4" />
                </a>

                <div className="text-xs text-muted font-medium">
                  تم التثبيت <span className="font-bold text-foreground tabular">{formatNumber(game.download_count ?? 0, locale)}</span> مرة من قِبل اللاعبين
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          CONTENT BLOCKS: OVERVIEW & SPECS, TRAILER, SCREENSHOTS, DOWNLOAD & UPDATES
         ========================================================================= */}
      <Container className="mt-14 space-y-16">
        {/* 1. About the Game, Key Highlights & Specifications (Exact layout of Hesham's site) */}
        <GameOverviewSpec
          game={game}
          extra={extra}
          locale={locale}
        />

        {/* 2. Arabic Localization Screenshots */}
        <GameScreenshots
          title={title}
          screenshots={extra.screenshots}
        />

        {/* 4. Download & Installation Instructions */}
        <DownloadSection
          gameTitle={title}
          versions={versions}
          extra={extra}
          locale={locale}
          isAuthenticated={Boolean(user)}
          gameSlug={game.slug}
        />

        {/* 5. Support & Coffee Widget */}
        <SupportWidget />

        {/* 6. Updates & Community Channels */}
        <UpdatesTracker />

        {/* 7. Community Free Request Banner */}
        <CommunityRequest />
      </Container>
    </div>
  );
}