import { ArrowRight, Layers } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DeleteVersionButton } from "@/components/admin/confirm-delete";
import { GameForm } from "@/components/admin/game-form";
import { VersionForm } from "@/components/admin/version-form";
import { Card, Badge } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { requireStaff } from "@/lib/auth";
import { getGameById, getGameVersions } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEditGamePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.games");
  const tv = await getTranslations("admin.versions");

  await requireStaff(locale);

  const game = await getGameById(id);
  if (!game) notFound();

  const versions = await getGameVersions(id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/games"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          <span>العودة لقائمة الألعاب</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          تعديل اللعبة: {game.title_ar}
        </h1>
        <p className="mt-1 text-sm text-muted">
          إدارة مواصفات اللعبة، وصف القصة، أبرز المميزات، سكرين شوتات التعريب، وإصدارات التحميل.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] items-start">
        {/* Main Game Details & Specs Form */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold text-foreground">
              بيانات ومواصفات اللعبة وسكرين شوتات التعريب
            </h2>
            <p className="text-xs text-muted mt-0.5">
              تظهر هذه البيانات مباشرة في صفحة اللعبة الرئيسية ومكتبة التعريبات.
            </p>
          </div>
          <GameForm game={game} />
        </Card>

        {/* Localization Versions Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold text-foreground">
                  إصدارات وباتشات التعريب ({versions.length})
                </h2>
              </div>
              <p className="text-xs text-muted mt-0.5">
                تحديد رقم الإصدار، المنصة، وحجم ملف التحميل
              </p>
            </div>

            {versions.length > 0 ? (
              <ul className="divide-y divide-border">
                {versions.map((v) => {
                  let meta: { platform?: string; fileSize?: string } = {};
                  if (v.notes_en && v.notes_en.startsWith("{")) {
                    try {
                      meta = JSON.parse(v.notes_en);
                    } catch {}
                  }

                  return (
                    <li
                      key={v.id}
                      className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge tone="accent" className="tabular font-bold">
                            v{v.version}
                          </Badge>
                          <span className="rounded bg-surface-2 px-2 py-0.5 text-[10px] font-semibold text-muted">
                            {meta.platform || "PC"}
                          </span>
                        </div>
                        <DeleteVersionButton versionId={v.id} locale={locale} />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{formatDate(v.release_date ?? v.created_at, locale)}</span>
                        <span className="tabular font-semibold text-foreground">
                          {v.download_count} تنزيل
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted">
                لا توجد إصدارات مضافة بعد. أضف أول إصدار للباتش أدناه.
              </p>
            )}

            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                إضافة إصدار جديد
              </h3>
              <VersionForm gameId={id} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}