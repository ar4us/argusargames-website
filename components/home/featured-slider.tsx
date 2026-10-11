"use client";

import { ArrowRight, CheckCircle2, Download, Gamepad2, Layers, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import type { GameWithLatest } from "@/lib/types";
import { formatNumber, getLocalized } from "@/lib/utils";

interface FeaturedSliderProps {
  games: GameWithLatest[];
  locale: string;
}

export function FeaturedSlider({ games, locale }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slider every 6 seconds
  useEffect(() => {
    if (games.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [games.length]);

  if (!games || games.length === 0) return null;

  const currentGame = games[currentIndex];
  const title = getLocalized(currentGame, "title", locale);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1a3d22] bg-[#030905] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(0,255,102,0.15)]">
      {/* Background Poster Banner with Glow */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden">
        {currentGame.cover_url ? (
          <Image
            src={currentGame.cover_url}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transition-all duration-700 ease-out scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#06150b] via-[#030905] to-black" />
        )}

        {/* Cinematic Scrims & Cyber Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-[#020503]/70 to-transparent" />
        <div className="absolute inset-0 rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-[#020503] via-[#020503]/80 to-transparent sm:max-w-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,102,0.15),transparent_60%)]" />

        {/* Content Box */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-3xl">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00ff66]/40 bg-[#00ff66]/15 px-3 py-1 text-xs font-mono font-bold text-[#00ff66] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>تعريب حصري ومكتمل</span>
            </span>
            <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 text-xs font-mono text-white/80 backdrop-blur-md">
              PC &amp; Consoles
            </span>
            {currentGame.latest_version && (
              <span className="rounded-full border border-[#00ff66]/30 bg-[#030b06] px-2.5 py-0.5 text-xs font-mono font-bold text-[#00ff66]">
                v{currentGame.latest_version}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
            {title}
          </h2>
          <p className="mt-1 text-sm sm:text-base font-mono text-[#8cb097]">
            {currentGame.title_en}
          </p>

          {/* Description snippet */}
          <p className="mt-4 text-sm sm:text-base text-slate-300 line-clamp-2 max-w-xl leading-relaxed">
            {getLocalized(currentGame, "description", locale) ||
              "تعريب كامل وشامل للنصوص والقوائم والحوارات، مع خطوط عربية مخصصة ومحاذاة تامة للأصل."}
          </p>

          {/* Actions & Metrics */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/games/${currentGame.slug}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00ff66] text-[#020703] font-black text-sm transition-all duration-300 hover:bg-[#22ff77] hover:shadow-[0_0_30px_rgba(0,255,102,0.6)] shadow-lg shadow-[#00ff66]/25"
            >
              <Download className="h-4 w-4" />
              <span>تحميل التعريب الآن</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>

            <Link
              href="/games"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#061209]/80 border border-[#1b3d22] text-white font-bold text-sm transition-all duration-300 hover:border-[#00ff66] hover:text-[#00ff66] backdrop-blur-md"
            >
              <Layers className="h-4 w-4" />
              <span>استعراض كل الألعاب</span>
            </Link>

            <div className="ms-auto hidden sm:flex items-center gap-2 font-mono text-xs text-[#789d84]">
              <Download className="h-4 w-4 text-[#00ff66]" />
              <span className="text-white font-bold">{formatNumber(currentGame.download_count ?? 0, locale)}</span>
              <span>تحميل</span>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation Bar at Bottom Right */}
        <div className="absolute bottom-6 end-6 z-20 flex items-center gap-2">
          {games.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={getLocalized(g, "title", locale)}
              className={`relative h-12 w-14 rounded-lg overflow-hidden border transition-all duration-300 ${
                idx === currentIndex
                  ? "border-[#00ff66] ring-2 ring-[#00ff66]/40 scale-105"
                  : "border-[#142e1a] opacity-50 hover:opacity-90"
              }`}
            >
              {g.cover_url ? (
                <Image src={g.cover_url} alt="" fill className="object-cover" />
              ) : (
                <div className="h-full w-full bg-[#0a180e]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
