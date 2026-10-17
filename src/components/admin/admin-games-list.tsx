"use client";

import { useEffect, useState } from "react";
import { Link2, Check, EyeOff, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { DeleteGameButton } from "@/components/admin/confirm-delete";
import { createClient } from "@/lib/supabase/client";
import type { Game } from "@/lib/types";

interface AdminGamesListProps {
  initialGames: Game[];
  locale: string;
}

export function AdminGamesList({ initialGames, locale }: AdminGamesListProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ id: string; text: string; success: boolean } | null>(null);

  // Live query on mount to ensure admin always sees latest live database state
  const refreshGames = async () => {
    try {
      const sb = createClient();
      const { data, error } = await sb
        .from("games")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setGames(data as Game[]);
      }
    } catch {}
  };

  useEffect(() => {
    refreshGames();
  }, []);

  const handleTogglePublished = async (game: Game) => {
    const nextPublished = !game.published;
    setUpdatingId(game.id);

    // Optimistic UI update
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, published: nextPublished } : g))
    );

    try {
      const sb = createClient();
      const { error } = await sb
        .from("games")
        .update({ published: nextPublished })
        .eq("id", game.id);

      if (error) {
        // Revert on error
        setGames((prev) =>
          prev.map((g) => (g.id === game.id ? { ...g, published: !nextPublished } : g))
        );
        setToastMsg({
          id: game.id,
          text: `فشل التحديث: ${error.message}`,
          success: false,
        });
      } else {
        setToastMsg({
          id: game.id,
          text: nextPublished
            ? "تم تفعيل نشر اللعبة! تظهر الآن لجميع الزوار."
            : "تم تحويل اللعبة إلى مسودة! أصبحت مخفية عن الزوار.",
          success: true,
        });
      }
    } catch (err: any) {
      setGames((prev) =>
        prev.map((g) => (g.id === game.id ? { ...g, published: !nextPublished } : g))
      );
      setToastMsg({
        id: game.id,
        text: `حدث خطأ: ${err?.message || "غير معروف"}`,
        success: false,
      });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const isAr = locale === "ar";

  if (games.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        {isAr ? "لا توجد أي ألعاب مسجلة في قاعدة البيانات بعد." : "No games in database yet."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {toastMsg && (
        <div
          className={`rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold border flex items-center justify-between gap-3 transition-all ${
            toastMsg.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          <span>{toastMsg.text}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted px-1">
        <span>
          {isAr
            ? `إجمالي الألعاب: ${games.length} (يمكنك التحكم المباشر في النشر بنقرة واحدة)`
            : `Total Games: ${games.length} (Click toggle to publish/unpublish instantly)`}
        </span>
        <button
          type="button"
          onClick={refreshGames}
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{isAr ? "تحديث القائمة" : "Refresh"}</span>
        </button>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
        {games.map((game) => {
          const isPending = updatingId === game.id;
          const isPublished = Boolean(game.published);

          return (
            <li
              key={game.id}
              className="flex flex-wrap items-center gap-4 px-4 py-3 sm:flex-nowrap transition-colors hover:bg-surface-2/40"
            >
              {/* Cover Thumbnail */}
              <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-surface-2 border border-border/50">
                {game.cover_url ? (
                  <img
                    src={game.cover_url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <LogoMark className="absolute inset-0 m-auto h-5 w-5 opacity-40" />
                )}
              </span>

              {/* Title & Slug */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground text-sm">
                  {game.title_ar}
                  {game.title_en && game.title_en !== game.title_ar ? (
                    <span className="font-normal text-muted">
                      {" "}· {game.title_en}
                    </span>
                  ) : null}
                </p>
                <a
                  href={`/${locale}/games/${game.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tabular truncate text-xs text-muted hover:text-blue-600 dark:hover:text-blue-400 block transition-colors"
                  dir="ltr"
                >
                  /games/{game.slug} ↗
                </a>
              </div>

              {/* Instant Real-Time Publishing Toggle Switch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleTogglePublished(game)}
                  aria-label={isPublished ? "إلغاء النشر (تحويل لمسودة)" : "تفعيل النشر للجميع"}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shadow-xs ${
                    isPending
                      ? "opacity-50 cursor-not-allowed bg-surface-2 border border-border"
                      : isPublished
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-surface-2 text-muted border border-border hover:bg-surface-2/80 hover:text-foreground"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isPublished ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {isPublished
                      ? isAr
                        ? "منشورة للزوار"
                        : "Published"
                      : isAr
                      ? "مسودة مخفية"
                      : "Draft (Hidden)"}
                  </span>
                </button>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`/${locale}/admin/games/${game.id}`}
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>{isAr ? "تعديل" : "Edit"}</span>
                </a>
                <DeleteGameButton client:load gameId={game.id} locale={locale} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
