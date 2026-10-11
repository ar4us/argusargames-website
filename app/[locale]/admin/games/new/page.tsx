import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GameForm } from "@/components/admin/game-form";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { requireStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminNewGamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.games");

  await requireStaff(locale);

  return (
    <div>
      <Link
        href="/admin/games"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-accent"
      >
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        {t("title")}
      </Link>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
        {t("add")}
      </h1>
      <Card className="max-w-3xl p-6">
        <GameForm />
      </Card>
    </div>
  );
}