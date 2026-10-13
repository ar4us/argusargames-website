import { Gamepad2, Layers, Inbox, Download } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireStaff } from "@/lib/auth";
import { getStats } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  await requireStaff(locale);
  const stats = await getStats();

  const cards = [
    { label: t("stats.games"), value: stats.games, Icon: Gamepad2 },
    { label: t("stats.versions"), value: stats.versions, Icon: Layers },
    { label: t("stats.requests"), value: stats.requests, Icon: Inbox },
    { label: t("stats.downloads"), value: stats.downloads, Icon: Download },
  ];

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
        {t("dashboard")}
      </h2>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="rounded-[var(--radius-card)] border border-border bg-surface p-5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="tabular mt-4 text-2xl font-bold text-foreground">
              {formatNumber(value)}
            </p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}