import { getTranslations } from "next-intl/server";

export async function SetupNotice() {
  const t = await getTranslations("setup");
  return (
    <div className="rounded-[var(--radius-card)] border border-warning/50 bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] p-4 text-sm text-warning">
      <p className="font-semibold">{t("title")}</p>
      <p className="mt-1 text-warning/80">{t("text")}</p>
    </div>
  );
}