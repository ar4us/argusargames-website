"use client";

import { Download, CheckCircle2, ShieldCheck, Terminal, AlertCircle } from "lucide-react";
import type { GameVersion } from "@/lib/types";
import { DownloadButton } from "@/components/games/download-button";
import type { GameExtraDetail } from "@/lib/game-details";
import { formatDate } from "@/lib/utils";

import { Link } from "@/i18n/navigation";
import { LogIn } from "lucide-react";

interface DownloadSectionProps {
  gameTitle: string;
  versions: GameVersion[];
  extra: GameExtraDetail;
  locale: string;
  isAuthenticated?: boolean;
  gameSlug?: string;
}

export function DownloadSection({
  gameTitle,
  versions,
  extra,
  locale,
  isAuthenticated = false,
  gameSlug,
}: DownloadSectionProps) {
  const latestVersion = versions[0];
  let versionFileSize = "";
  if (latestVersion?.notes_en && latestVersion.notes_en.startsWith("{")) {
    try {
      const parsed = JSON.parse(latestVersion.notes_en);
      if (parsed.fileSize) versionFileSize = parsed.fileSize;
    } catch {}
  }
  const displayFileSize = versionFileSize || extra.fileSize || "غير محدد";

  return (
    <section id="download-section" className="space-y-6">
      <div className="flex items-center gap-2">
        <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          تحميل التعريب
        </h2>
      </div>

      {/* Main Download Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 text-xs font-bold">
                  {latestVersion ? `الإصدار v${latestVersion.version}` : "الإصدار v1.0"}
                </span>
                <span className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
                  الحجم: {displayFileSize}
                </span>
                <span className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
                  المنصة: PC (Windows)
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  مفحوص وآمن 100%
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground">
                باتش تعريب {gameTitle} الكامل
              </h3>
              <p className="text-sm text-muted">
                {latestVersion?.release_date
                  ? `آخر تحديث: ${formatDate(latestVersion.release_date, locale)}`
                  : "يشمل تعريب كافة القوائم والحوارات والواجهات والنصوص"}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isAuthenticated ? (
                latestVersion ? (
                  <DownloadButton
                    versionId={latestVersion.id}
                    count={latestVersion.download_count}
                    locale={locale}
                    label="تحميل التعريب (رابط مباشر)"
                    variant="primary"
                    size="lg"
                    showCount={true}
                    className="w-full sm:w-auto shadow-md shadow-blue-600/20"
                  />
                ) : (
                  <a
                    href="#download-section"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    تحميل التعريب
                  </a>
                )
              ) : (
                <Link
                  href={`/login?redirectTo=${encodeURIComponent(`/${locale}/games/${gameSlug || ""}`)}`}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition-all duration-200 hover:scale-[1.02]"
                >
                  <LogIn className="h-4 w-4" />
                  <span>تسجيل الدخول للتحميل</span>
                </Link>
              )}
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl bg-surface-2/60 p-3">
              <span className="text-muted block font-medium">نوع التثبيت</span>
              <span className="text-foreground font-bold mt-0.5 block truncate">
                {extra.patchType}
              </span>
            </div>
            <div className="rounded-xl bg-surface-2/60 p-3">
              <span className="text-muted block font-medium">حالة التعريب</span>
              <span className="text-foreground font-bold mt-0.5 block">
                {extra.status}
              </span>
            </div>
            <div className="rounded-xl bg-surface-2/60 p-3">
              <span className="text-muted block font-medium">حجم التحميل</span>
              <span className="text-foreground font-bold mt-0.5 block">
                {displayFileSize}
              </span>
            </div>
            <div className="rounded-xl bg-surface-2/60 p-3">
              <span className="text-muted block font-medium">نظام التشغيل</span>
              <span className="text-foreground font-bold mt-0.5 block">
                Windows 10 / 11
              </span>
            </div>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="border-t border-border bg-surface-2/30 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              طريقة التثبيت خطوة بخطوة
            </h4>
          </div>

          <div className="space-y-4">
            {extra.installSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {step.step}
                </span>
                <div className="space-y-0.5 pt-0.5">
                  <span className="font-semibold text-sm text-foreground block">
                    {step.title}
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {extra.compatibilityNotes && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-xs text-muted">
              <AlertCircle className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <span>{extra.compatibilityNotes}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
