import { Download, Sparkles } from "lucide-react";
import Image from "next/image";
import { LogoMark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { GameWithLatest } from "@/lib/types";
import { formatNumber, getLocalized } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function GameCard({
  game,
  locale,
}: {
  game: GameWithLatest;
  locale: string;
}) {
  const t = await getTranslations("games");
  const title = getLocalized(game, "title", locale);

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[16px] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
    >
      {/* Cover Media Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-2">
        {game.cover_url ? (
          <Image
            src={game.cover_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface to-surface-2">
            <LogoMark className="h-12 w-12 opacity-30" />
          </div>
        )}

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

        {/* Version Badge (Top Start) */}
        <div className="absolute start-3 top-3 z-10">
          {game.latest_version ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="tabular">v{game.latest_version}</span>
            </span>
          ) : null}
        </div>

        {/* Quick hover download indicator */}
        <div className="absolute bottom-3 end-3 z-10 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/30">
            <Download className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-accent">
            {title}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-muted font-mono">
            {game.title_en}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
            <Download className="h-3.5 w-3.5 text-accent" />
            <span className="tabular font-semibold">
              {formatNumber(game.download_count ?? 0, locale)}
            </span>
          </span>
          <span className="text-[11px] text-muted">
            {game.latest_version ? t("latestVersion") : t("noVersion")}
          </span>
        </div>
      </div>
    </Link>
  );
}
