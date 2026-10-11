import { Download, Sparkles } from "lucide-react";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-border-strong hover:shadow-lg hover:shadow-black/5"
    >
      {/* Cover image container */}
      <div className="relative aspect-[16/10] sm:aspect-[3/2] w-full overflow-hidden bg-surface-2">
        {game.cover_url ? (
          <Image
            src={game.cover_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface-2 text-muted">
            <Gamepad2 className="h-10 w-10 opacity-30" />
          </div>
        )}

        {/* Platform & Status Badges */}
        <div className="absolute top-2.5 start-2.5 flex items-center gap-1.5">
          <span className="rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            PC
          </span>
          {game.latest_version && (
            <span className="rounded-md bg-blue-600/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              v{game.latest_version}
            </span>
          )}
        </div>
      </div>

      {/* Info container */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-bold text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted font-medium">
            {game.title_en}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <Download className="h-3.5 w-3.5 text-muted" />
            <span className="tabular">{formatNumber(game.download_count ?? 0, locale)}</span>
          </span>
          <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
            تحميل التعريب ←
          </span>
        </div>
      </div>
    </Link>
  );
}
