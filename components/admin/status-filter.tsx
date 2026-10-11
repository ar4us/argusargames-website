"use client";

import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/field";
import { useRouter } from "@/i18n/navigation";

const STATUSES = ["", "pending", "approved", "in_progress", "completed", "rejected"];

export function StatusFilter({ value }: { value: string }) {
  const t = useTranslations("admin.requests");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const router = useRouter();

  return (
    <Select
      value={value}
      aria-label={t("filter")}
      onChange={(e) => {
        const status = e.target.value;
        router.replace({
          pathname: "/admin/requests",
          query: status ? { status } : {},
        });
      }}
      className="w-48"
    >
      <option value="">{tc("all")}</option>
      {STATUSES.filter(Boolean).map((s) => (
        <option key={s} value={s}>
          {ts(s)}
        </option>
      ))}
    </Select>
  );
}