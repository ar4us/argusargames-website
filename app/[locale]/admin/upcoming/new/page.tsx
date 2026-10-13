import { setRequestLocale } from "next-intl/server";
import { UpcomingGameForm } from "@/components/admin/upcoming-form";
import { requireStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewUpcomingGamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireStaff(locale);

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          إضافة مشروع تعريب قادم جديد
        </h2>
        <p className="mt-1 text-sm text-muted">
          أدخل تفاصيل اللعبة ونسبة الإنجاز لتظهر في قسم المشاريع القادمة
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
        <UpcomingGameForm locale={locale} />
      </div>
    </div>
  );
}
