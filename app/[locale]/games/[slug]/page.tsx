import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Layers,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LogoMark } from "@/components/brand/logo";
import { VersionList } from "@/components/games/version-list";
import { buttonVariants } from "@/components/ui/button";
import { Card, Badge } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getGameBySlug, getGameVersions } from "@/lib/queries";
import { alternates, absoluteUrl } from "@/lib/seo";
import { formatNumber, getLocalized } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return {};
  const title = getLocalized(game, "title", locale);
  const description = getLocalized(game, "description", locale) || undefined;
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
  const tc = await getTranslations("common");

  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const versions = await getGameVersions(game.id);
  const title = getLocalized(game, "title", locale);
  const altTitle = getLocalized(game, "title", locale === "ar" ? "en" : "ar");
  const description = getLocalized(game, "description", locale);

  return (
    <Container className="py-10">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/games" className="hover:text-accent">
          {t("backToGames")}
        </Link>
        <span aria-hidden>·</span>
        <span className="truncate text-foreground">{title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-12">
        {/* Cover */}
        <div>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-2 shadow-lg shadow-black/5">
            {game.cover_url ? (
              <Image
                src={game.cover_url}
                alt={title}
                width={640}
                height={853}
                priority
                className="h-auto w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center">
                <LogoMark className="h-20 w-20 opacity-40" />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
            {title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-medium text-muted">{altTitle}</span>
            <Badge tone="accent" className="tabular">
              <Layers className="h-3 w-3" />
              {formatNumber((game as { version_count?: number }).version_count ?? versions.length, locale)}{" "}
              {t("versions")}
            </Badge>
          </div>

          {game.steam_url ? (
            <a
              href={game.steam_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              {t("steam")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}

          {description ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                {t("description")}
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-foreground/90">
                {description}
              </p>
            </div>
          ) : null}

          <Link
            href="/request"
            className={`${buttonVariants({ variant: "ghost", size: "sm" })} mt-6 text-accent`}
          >
            {t("requestThis")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* Versions */}
      <section className="mt-12">
        <div className="mb-5 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-accent" aria-hidden />
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t("versions")}
          </h2>
        </div>
        <VersionList versions={versions} locale={locale} />
      </section>
    </Container>
  );
}