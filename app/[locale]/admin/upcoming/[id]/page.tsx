import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { UpcomingGameForm } from "@/components/admin/upcoming-form";
import { requireStaff } from "@/lib/auth";
import { getUpcomingGameById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditUpcomingGamePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireStaff(locale);

  const game = await getUpcomingGameById(id);
  if (!game) notFound();

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          تعديل مشروع: {game.title_ar}
        </h2>
        <p className="mt-1 text-sm text-muted">
          تحديث نسبة الإنجاز، الحالة، أو الموعد المتوقع للمشروع
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
        <UpcomingGameForm game={game} locale={locale} />
      </div>
    </div>
  );
}
