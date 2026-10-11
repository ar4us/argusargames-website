import { Download, Sparkles } from "lucide-react";
import Image from "next/image";
import { LogoMark } from "@/components/brand/logo";
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#142e1a] bg-[#07120a] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00ff66]/60 hover:shadow-[0_0_30px_rgba(0,255,102,0.15)]"
    >
      {/* Cover Media Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a180e]">
        {game.cover_url ? (
          <Image
            src={game.cover_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#07120a] to-[#0a180e]">
            <LogoMark className="h-12 w-12 opacity-30" />
          </div>
        )}

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07120a] via-black/30 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-50" />

        {/* Status Badge & Version (Top Start) */}
        <div className="absolute start-3 top-3 z-10 flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md border border-[#00ff66]/40 bg-[#040c06]/90 px-2 py-0.5 text-[11px] font-bold text-[#00ff66] backdrop-blur-md shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-pulse" />
            <span>تعريب مكتمل</span>
          </span>
          {game.latest_version ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/75 px-2 py-0.5 text-[10px] font-mono text-white/90 backdrop-blur-md">
              <Sparkles className="h-2.5 w-2.5 text-[#00ff66]" />
              <span>v{game.latest_version}</span>
            </span>
          ) : null}
        </div>

        {/* Platform tag (Top End) */}
        <div className="absolute end-3 top-3 z-10">
          <span className="rounded-md border border-[#1b3d22] bg-[#020503]/85 px-2 py-0.5 text-[10px] font-mono font-bold text-[#739980] backdrop-blur-md">
            PC
          </span>
        </div>

        {/* Quick hover download indicator */}
        <div className="absolute bottom-3 end-3 z-10 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00ff66] text-[#020703] shadow-lg shadow-[#00ff66]/40 font-bold">
            <Download className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-bold leading-tight text-white transition-colors duration-200 group-hover:text-[#00ff66]">
            {title}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-[#789d84] font-mono">
            {game.title_en}
          </p>

          {/* Localization scope chips */}
          <div className="mt-2.5 flex flex-wrap gap-1 text-[10px] font-mono text-[#789d84]">
            <span className="rounded bg-[#0c1c11] border border-[#142e1a] px-1.5 py-0.5">النصوص</span>
            <span className="rounded bg-[#0c1c11] border border-[#142e1a] px-1.5 py-0.5">القوائم</span>
            <span className="rounded bg-[#0c1c11] border border-[#142e1a] px-1.5 py-0.5">الحوارات</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#142e1a] pt-3 text-xs text-[#789d84]">
          <span className="inline-flex items-center gap-1.5 font-medium text-white/90">
            <Download className="h-3.5 w-3.5 text-[#00ff66]" />
            <span className="tabular font-semibold font-mono">
              {formatNumber(game.download_count ?? 0, locale)}
            </span>
          </span>
          <span className="text-[11px] text-[#00ff66] font-mono">
            تحميل مباشر
          </span>
        </div>
      </div>
    </Link>
  );
}
