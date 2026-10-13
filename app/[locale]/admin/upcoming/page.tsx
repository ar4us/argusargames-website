import Image from "next/image";
import { Link2, Plus, Sparkles, Clock, Calendar } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { DeleteUpcomingButton } from "@/components/admin/confirm-delete";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { requireStaff } from "@/lib/auth";
import { getUpcomingGames } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUpcomingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requireStaff(locale);
  const upcomingGames = await getUpcomingGames();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>التعريبات القادمة ومشاريع قيد العمل</span>
          </h2>
          <p className="mt-1 text-xs text-muted">
            إدارة مشاريع التعريب التي تعمل عليها حالياً لتظهر في الموقع للمتابعين
          </p>
        </div>

        <Link href="/admin/upcoming/new" className={buttonVariants({ size: "sm" })}>
          <Plus className="h-4 w-4" />
          <span>إضافة مشروع قادم</span>
        </Link>
      </div>

      {upcomingGames.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-12 text-center text-sm text-muted">
          <Sparkles className="mx-auto h-8 w-8 text-muted/50 mb-3" />
          <p className="font-semibold text-foreground">لا توجد مشاريع تعريب قادمة حالياً</p>
          <p className="mt-1 text-xs text-muted">
            أضف مشروعاً جديداً لتخبر اللاعبين بنسبة إنجازه وموعد صدوره المتوقع!
          </p>
          <div className="mt-4">
            <Link href="/admin/upcoming/new" className={buttonVariants({ size: "sm" })}>
              <Plus className="h-4 w-4" />
              <span>إضافة أول مشروع قادم</span>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
          {upcomingGames.map((game) => (
            <li
              key={game.id}
              className="flex flex-wrap items-center gap-4 px-4 py-4 sm:flex-nowrap"
            >
              <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-2 border border-border">
                {game.cover_url ? (
                  <Image
                    src={game.cover_url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <Sparkles className="absolute inset-0 m-auto h-6 w-6 opacity-30 text-amber-500" />
                )}
              </span>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-foreground">
                    {game.title_ar}
                  </p>
                  <span className="text-xs text-muted font-medium" dir="ltr">
                    ({game.title_en})
                  </span>
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {game.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3 pt-1 max-w-md">
                  <div className="h-2 flex-1 rounded-full bg-surface-2 overflow-hidden border border-border/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, game.progress_percentage))}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground tabular">
                    %{formatNumber(game.progress_percentage)}
                  </span>
                </div>

                {game.expected_date ? (
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>الموعد المتوقع: {game.expected_date}</span>
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/upcoming/${game.id}`}
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>تعديل</span>
                </Link>
                <DeleteUpcomingButton id={game.id} locale={locale} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/admin"
        className="mt-6 inline-block text-sm text-muted hover:text-accent"
      >
        ← العودة للوحة التحكم
      </Link>
    </div>
  );
}
