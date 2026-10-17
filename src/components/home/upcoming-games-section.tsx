import Image from "next/image";
import { Sparkles, Calendar, Gamepad2, Clock, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { UpcomingGame } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface UpcomingGamesSectionProps {
  games: UpcomingGame[];
  locale: string;
}

export function UpcomingGamesSection({ games, locale }: UpcomingGamesSectionProps) {
  if (!games || games.length === 0) return null;

  return (
    <section className="relative pt-6">
      <Container>
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>مشاريع تحت التطوير والتعريب</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              التعريبات القادمة
            </h2>
            <p className="mt-1 text-sm text-muted">
              مشاريع نعمل عليها حالياً بكل شغف لنقدمها لكم بأعلى جودة، تابع نسب الإنجاز ومواعيد الصدور
            </p>
          </div>
        </div>

        {/* Upcoming Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => {
            const pct = Math.min(100, Math.max(0, game.progress_percentage));
            return (
              <div
                key={game.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                {/* 16:9 Banner Cover */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
                  {game.cover_url ? (
                    <Image
                      src={game.cover_url}
                      alt={game.title_ar}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-surface-2 text-muted">
                      <Gamepad2 className="h-12 w-12 opacity-30" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 start-3 flex items-center gap-1.5">
                    <span className="rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      {game.platforms || "PC"}
                    </span>
                    <span className="rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{game.status}</span>
                    </span>
                  </div>

                  {/* Bottom percentage in cover */}
                  <div className="absolute bottom-3 end-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-black text-amber-400 backdrop-blur-md">
                    <span>نسبة الإنجاز:</span>
                    <span className="tabular font-black">%{formatNumber(pct)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-amber-500 transition-colors">
                      {game.title_ar}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted font-medium" dir="ltr">
                      {game.title_en}
                    </p>

                    {game.description ? (
                      <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                        {game.description}
                      </p>
                    ) : null}
                  </div>

                  {/* Progress Bar & Expected Date */}
                  <div className="space-y-2.5 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                        <span>تقدم العمل</span>
                      </span>
                      <span className="text-foreground tabular font-bold">%{formatNumber(pct)}</span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-surface-2 overflow-hidden border border-border/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {game.expected_date ? (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted font-medium">
                        <Calendar className="h-3 w-3 text-amber-500" />
                        <span>الموعد المتوقع: <strong className="text-foreground">{game.expected_date}</strong></span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
