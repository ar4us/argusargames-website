import { CalendarDays, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { VoteButton } from "@/components/request/vote-button";
import { Badge } from "@/components/ui/card";
import type { LocalizationRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const statusTone: Record<
  LocalizationRequest["status"],
  "neutral" | "accent" | "success" | "warning" | "danger" | "info"
> = {
  pending: "warning",
  approved: "accent",
  in_progress: "info",
  completed: "success",
  rejected: "danger",
};

function requestDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export async function RequestList({
  requests,
  myVotes,
  locale,
  empty = "noTopRequests",
}: {
  requests: LocalizationRequest[];
  myVotes: string[];
  locale: string;
  empty?: string;
}) {
  const t = await getTranslations("request");

  if (requests.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-10 text-center text-sm text-muted">
        {t(empty)}
      </p>
    );
  }

  return (
    <ol className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
      {requests.map((req, index) => (
        <li key={req.id} className="flex items-start gap-3 px-4 py-3.5">
          <span className="tabular w-6 shrink-0 pt-0.5 text-center text-sm font-semibold text-muted">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">
                {req.game_name}
              </span>
              {req.request_type === "bug_report" || req.notes?.includes("نوع المشكلة:") ? (
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  إبلاغ عن خطأ
                </span>
              ) : req.request_type === "update_request" || req.notes?.includes("إصدار/تفاصيل التحديث:") ? (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  طلب تحديث
                </span>
              ) : (
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  طلب تعريب
                </span>
              )}
              <Badge tone={statusTone[req.status]}>
                {t(`status.${req.status}`)}
              </Badge>
            </div>
            {req.game_url ? (
              <a
                href={req.game_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-muted hover:text-accent"
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                <span className="truncate">{requestDomain(req.game_url)}</span>
              </a>
            ) : null}
            {req.notes ? (
              <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm text-foreground/70">
                {req.notes}
              </p>
            ) : null}
            <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted">
              <CalendarDays className="h-3 w-3" />
              {formatDate(req.created_at, locale)}
            </p>
          </div>
          <VoteButton
            requestId={req.id}
            initialCount={req.vote_count}
            initialVoted={myVotes.includes(req.id)}
            className="shrink-0"
          />
        </li>
      ))}
    </ol>
  );
}