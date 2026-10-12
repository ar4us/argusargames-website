import { Download, Play, Gamepad2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { GameWithLatest } from "@/lib/types";
import { formatNumber, getLocalized, formatDate } from "@/lib/utils";
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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5">
      {/* 16:9 Banner Cover */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
        <Link href={`/games/${game.slug}`} className="block h-full w-full">
          {game.cover_url ? (
            <Image
              src={game.cover_url}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface-2 text-muted">
              <Gamepad2 className="h-10 w-10 opacity-30" />
            </div>
          )}
        </Link>

        {/* Top Badges */}
        <div className="pointer-events-none absolute top-3 start-3 flex items-center gap-1.5">
          <span className="rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
            PC
          </span>
          {game.latest_version && (
            <span className="rounded-md bg-blue-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
              v{game.latest_version}
            </span>
          )}
        </div>

        {/* Official Trailer Button Badge */}
        <Link
          href={`/games/${game.slug}`}
          className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/95 backdrop-blur-md transition-all duration-200 hover:bg-blue-600 hover:scale-105"
        >
          <Play className="h-3 w-3 fill-current text-blue-400 group-hover:text-white" />
          <span>العرض الرسمي</span>
        </Link>
      </div>

      {/* Info & Title */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <Link href={`/games/${game.slug}`} className="block">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            تعريب
          </span>
          <h3 className="line-clamp-1 text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted font-medium" dir="ltr">
            {game.title_en}
          </p>
        </Link>

        {/* Card Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
          <span className="inline-flex items-center gap-1 text-muted font-medium">
            <Download className="h-3.5 w-3.5" />
            <span className="tabular">{formatNumber(game.download_count ?? 0, locale)}</span>
          </span>

          <Link
            href={`/games/${game.slug}`}
            className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
          >
            <span>اقرأ وحمّل</span>
            <span className="text-sm rtl:rotate-180">←</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
