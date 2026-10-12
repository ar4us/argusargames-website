"use client";

import { ExternalLink } from "lucide-react";
import type { GameExtraDetail } from "@/lib/game-details";
import type { Game } from "@/lib/types";

interface GameOverviewSpecProps {
  game: Game;
  extra: GameExtraDetail;
  locale: string;
}

export function GameOverviewSpec({ game, extra }: GameOverviewSpecProps) {
  const highlights = extra.highlights && extra.highlights.length > 0
    ? extra.highlights
    : [
        "تعريب كامل لكافة القوائم والحوارات والنصوص",
        "خطوط عربية مريحة وواضحة داخل واجهة اللعبة",
        "متوافق مع أحدث التحديثات على منصة الحاسب الشخصي PC",
      ];

  const aboutText = extra.aboutGame || game.description_ar || "";

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] items-start">
      {/* Right Column: عن اللعبة + أبرز ما فيها */}
      <div className="space-y-8">
        {/* عن اللعبة */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-4">
            عن اللعبة
          </h2>
          <div className="prose prose-invert max-w-none text-muted leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
            {aboutText}
          </div>
        </div>

        {/* أبرز ما فيها */}
        <div className="space-y-3 pt-4">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mb-4">
            أبرز ما فيها
          </h3>

          <div className="space-y-2.5">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-surface/90 px-4 py-3.5 shadow-2xs transition-colors hover:border-amber-500/30"
              >
                <span className="text-xs sm:text-sm font-medium text-foreground/90">
                  {item}
                </span>
                <span className="shrink-0 text-amber-500 text-xs sm:text-sm ms-3">
                  🔶
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left Column: معلومات اللعبة (Game Info Specs Table) */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs">
        <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-3">
          معلومات اللعبة
        </h3>

        <dl className="divide-y divide-border/60 text-xs sm:text-sm">
          {/* الاسم الأصلي */}
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-muted shrink-0 font-medium">الاسم الأصلي</dt>
            <dd className="text-foreground font-semibold text-end truncate" dir="ltr">
              {game.title_en}
            </dd>
          </div>

          {/* يُعرف أيضاً بـ */}
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-muted shrink-0 font-medium">يُعرف أيضاً بـ</dt>
            <dd className="text-foreground font-semibold text-end truncate">
              {extra.knownAs || game.title_ar}
            </dd>
          </div>

          {/* النوع */}
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-muted shrink-0 font-medium">النوع</dt>
            <dd className="text-foreground font-semibold text-end">
              {extra.genre}
            </dd>
          </div>

          {/* تاريخ الصدور */}
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-muted shrink-0 font-medium">تاريخ الصدور</dt>
            <dd className="text-foreground font-semibold text-end">
              {extra.year}
            </dd>
          </div>

          {/* المطور */}
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-muted shrink-0 font-medium">المطور</dt>
            <dd className="text-foreground font-semibold text-end truncate">
              {extra.developer}
            </dd>
          </div>

          {/* الناشر */}
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-muted shrink-0 font-medium">الناشر</dt>
            <dd className="text-foreground font-semibold text-end truncate">
              {extra.publisher || extra.developer}
            </dd>
          </div>

          {/* المنصات */}
          <div className="py-2.5 flex items-center justify-between gap-4">
            <dt className="text-muted shrink-0 font-medium">المنصات</dt>
            <dd className="text-foreground font-semibold text-end" dir="ltr">
              {extra.platforms || "PC"}
            </dd>
          </div>

          {/* الموقع الرسمي / Steam */}
          {(extra.officialUrl || game.steam_url || extra.steamUrl) && (
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-muted shrink-0 font-medium">الموقع الرسمي</dt>
              <dd className="text-end truncate">
                <a
                  href={extra.officialUrl || game.steam_url || extra.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-amber-500 hover:underline text-xs"
                >
                  <span className="truncate max-w-[150px]">
                    {extra.officialUrl || game.steam_url || extra.steamUrl}
                  </span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
