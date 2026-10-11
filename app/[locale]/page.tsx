import {
  ArrowRight,
  Download,
  Flame,
  Sparkles,
  Gamepad2,
  FileText,
  Terminal,
} from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GameCard } from "@/components/games/game-card";
import { HeroSearch } from "@/components/home/hero-search";
import { FeatureGrid } from "@/components/home/feature-grid";
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
      {/* =========================================================================
          HERO SECTION — EXACT REPLICA OF ARGUSOS NEON MOCKUP
         ========================================================================= */}
      <section className="relative overflow-hidden border-b border-[#132d19] bg-[#020503]">
        {/* Background Hacker Panorama Artwork */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/branding/hero-bg.png"
            alt="ArgusOs Cyber World"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70"
          />
          {/* Gradients to guarantee 100% text legibility and seamless vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-[#020503]/50 to-transparent" />
          <div className="absolute inset-0 rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-[#020503] via-[#020503]/85 to-transparent" />
          <div className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_40%,rgba(0,255,102,0.12),transparent_50%)]" />
        </div>

        {/* Hero Content */}
        <Container className="relative z-10 pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
          <div className="max-w-2xl">
            {/* Cyber Terminal Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00ff66]/30 bg-[#06140b]/80 px-3.5 py-1 text-xs font-mono font-bold text-[#00ff66] mb-6 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]" />
              </span>
              <Terminal className="h-3 w-3" />
              <span>ARGUSOS • ARABIC GAME LOCALIZATION HUB</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight">
              <span className="block text-white">عالم الألعاب</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] via-[#1eff75] to-[#10b981] drop-shadow-[0_0_35px_rgba(0,255,102,0.5)] mt-2">
                باللغة العربية
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-[#94bfa2] max-w-xl leading-relaxed">
              موقع متخصص في تعريب الألعاب، يقدم لك باتشات احترافية، شروحات التثبيت، وأدوات التعريب، لتعيش تجربة لعب أفضل.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/games"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#00ff66] text-[#020703] font-black text-base transition-all duration-300 hover:bg-[#22ff77] hover:shadow-[0_0_30px_rgba(0,255,102,0.6)] hover:scale-[1.02] shadow-lg shadow-[#00ff66]/25"
              >
                <Gamepad2 className="h-5 w-5 fill-current" />
                <span>استكشف الألعاب</span>
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </Link>

              <Link
                href="/games"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-[#07140b]/90 border border-[#1b4423] text-white font-bold text-base transition-all duration-300 hover:border-[#00ff66] hover:bg-[#0c2213] hover:text-[#00ff66] backdrop-blur-md"
              >
                <FileText className="h-5 w-5 text-[#00ff66]" />
                <span>جميع الباتشات</span>
              </Link>
            </div>

            {/* Quick Search */}
            <div className="mt-8 max-w-xl">
              <HeroSearch />
            </div>

            {/* Live Stats */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#789d84]">
              <span className="tabular flex items-center gap-1.5">
                <span className="text-[#00ff66] font-bold">[{formatNumber(stats.games, locale)}]</span>
                <span>{t("statsGames")}</span>
              </span>
              <span className="text-[#193a20]">•</span>
              <span className="tabular flex items-center gap-1.5">
                <span className="text-[#00ff66] font-bold">[{formatNumber(stats.versions, locale)}]</span>
                <span>{t("statsVersions")}</span>
              </span>
              <span className="text-[#193a20]">•</span>
              <span className="tabular flex items-center gap-1.5">
                <span className="text-[#00ff66] font-bold">[{formatNumber(stats.downloads, locale)}]</span>
                <span>{t("statsDownloads")}</span>
              </span>
            </div>
          </div>
        </Container>

        {/* 6 Feature Highlights Bar matching the mockup base */}
        <div className="border-t border-[#132d19] bg-[#020503]/90 py-6">
          <Container>
            <FeatureGrid />
          </Container>
        </div>
      </section>

      {!isSupabaseConfigured() ? (
        <Container className="pt-6">
          <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
            <span className="font-semibold text-warning">Setup — </span>
            {tc("error")} Supabase. See README.
          </div>
        </Container>
      ) : null}

      {/* =========================================================================
          LATEST LOCALIZATIONS
         ========================================================================= */}
      <section className="py-16 border-b border-[#132d19]/60">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/30 text-[#00ff66]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {t("latest")}
                </h2>
              </div>
              <p className="mt-1 text-sm text-[#789d84]">
                أحدث تعريبات الألعاب التي تم إطلاقها أو تحديثها حديثاً
              </p>
            </div>

            <Link
              href="/games"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00ff66] hover:underline font-mono"
            >
              <span>{tc("viewAll")}</span>
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
          MOST DOWNLOADED RANKED LIST
         ========================================================================= */}
      {popular.length > 0 ? (
        <section className="py-16 border-b border-[#132d19]/60">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff66]/15 border border-[#00ff66]/30 text-[#00ff66]">
                    <Flame className="h-4 w-4" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    {t("mostDownloaded")}
                  </h2>
                </div>
                <p className="mt-1 text-sm text-[#789d84]">
                  التعريبات الأكثر شعبية وتحميلاً من قبل اللاعبين
                </p>
              </div>

              <Link
                href={{ pathname: "/games", query: { sort: "downloads" } }}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00ff66] hover:underline font-mono"
              >
                <span>{tc("viewAll")}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            <ol className="overflow-hidden rounded-2xl border border-[#142e1a] bg-[#061009] shadow-xl divide-y divide-[#142e1a]">
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
          COMMUNITY REQUEST BANNER
         ========================================================================= */}
      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-[#00ff66]/30 bg-gradient-to-br from-[#0a1e11] via-[#050e08] to-[#020503] p-8 sm:p-12 shadow-2xl">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00ff66]/15 border border-[#00ff66]/30 px-3 py-1 text-xs font-mono font-bold text-[#00ff66] mb-4">
                COMMUNITY REQUESTS • صوت المجتمع
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t("requestTitle")}
              </h2>
              <p className="mt-3 text-base text-[#8cb097] leading-relaxed">
                {t("requestText")}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/request"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#00ff66] text-[#020703] font-black text-sm transition-all duration-300 hover:bg-[#22ff77] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] shadow-lg shadow-[#00ff66]/20"
                >
                  <span>{t("requestCta")}</span>
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
    "bg-[#00ff66] text-[#020703] shadow-md shadow-[#00ff66]/30", // 1st Cyber Neon
    "bg-slate-300 text-black shadow-md shadow-slate-300/20", // 2nd Silver
    "bg-amber-700 text-white shadow-md shadow-amber-700/20", // 3rd Bronze
  ];

  return (
    <li>
      <Link
        href={`/games/${game.slug}`}
        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#0a180f]"
      >
        <span
          className={`tabular font-mono flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
            index < 3 ? rankBadgeColors[index] : "bg-[#0c1c11] text-[#789d84]"
          }`}
        >
          {index + 1}
        </span>

        <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-[#0a180e] shadow-sm">
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
          <span className="block truncate text-base font-bold text-white group-hover:text-[#00ff66] transition-colors">
            {title}
          </span>
          <span className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-[#789d84] font-mono">{game.title_en}</span>
            {game.latest_version ? (
              <span className="tabular font-mono text-[11px] font-bold text-[#00ff66] bg-[#00ff66]/10 px-1.5 py-0.2 rounded border border-[#00ff66]/20">
                v{game.latest_version}
              </span>
            ) : null}
          </span>
        </span>

        <span className="tabular font-mono inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#142e1a] bg-[#07120a] px-3.5 py-1 text-xs font-bold text-[#789d84] group-hover:border-[#00ff66]/40 group-hover:text-[#00ff66] transition-colors">
          <Download className="h-3.5 w-3.5 text-[#00ff66]" />
          <span>{formatNumber(game.download_count ?? 0, locale)}</span>
          <span className="hidden sm:inline font-normal text-[11px]">{t("downloads")}</span>
        </span>
      </Link>
    </li>
  );
}
