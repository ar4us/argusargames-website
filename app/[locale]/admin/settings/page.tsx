import { getTranslations, setRequestLocale } from "next-intl/server";
import { SettingsForm } from "@/components/admin/settings-form";
import { Card } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.settings");

  await requireStaff(locale);
  const settings = await getSettings();

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {t("title")}
      </h2>
      <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
      <Card className="mt-6 max-w-3xl p-6">
        <SettingsForm settings={settings} />
      </Card>
    </div>
  );
}