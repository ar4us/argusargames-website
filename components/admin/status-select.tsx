"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { updateRequestStatusAction } from "@/lib/actions/admin";
import { Select } from "@/components/ui/field";
import type { RequestStatus } from "@/lib/types";

const STATUSES: RequestStatus[] = [
  "pending",
  "approved",
  "in_progress",
  "completed",
  "rejected",
];

export function StatusSelect({
  requestId,
  value,
}: {
  requestId: string;
  value: RequestStatus;
}) {
  const t = useTranslations("admin.requests");
  const ts = useTranslations("status");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [local, setLocal] = useState(value);

  const change = (next: RequestStatus) => {
    setLocal(next);
    startTransition(async () => {
      await updateRequestStatusAction(requestId, next, locale);
    });
  };

  return (
    <Select
      value={local}
      aria-label={t("status")}
      disabled={pending}
      onChange={(e) => change(e.target.value as RequestStatus)}
      className="h-9 w-40 text-sm"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ts(s)}
        </option>
      ))}
    </Select>
  );
}