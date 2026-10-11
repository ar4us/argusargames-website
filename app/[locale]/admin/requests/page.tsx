import { CalendarDays } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StatusFilter } from "@/components/admin/status-filter";
import { StatusSelect } from "@/components/admin/status-select";
import { Badge } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth";
import { getAllRequests, getRequesters } from "@/lib/queries";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("admin.requests");
  const ts = await getTranslations("status");

  await requireStaff(locale);

  const status = typeof sp.status === "string" ? sp.status : "";
  const requests = await getAllRequests(status || undefined);
  const userIds = [...new Set(requests.map((r) => r.user_id))];
  const requesters = await getRequesters(userIds);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <StatusFilter value={status} />
      </div>

      {requests.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-10 text-center text-sm text-muted">
          {t("empty")}
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
          {requests.map((req) => {
            const requester = requesters[req.user_id];
            return (
              <li key={req.id} className="px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">
                      {req.game_name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {requester?.full_name || requester?.email || t("requester")}
                      {" · "}
                      <span className="tabular">
                        {formatNumber(req.vote_count, locale)}
                      </span>{" "}
                      {t("votes")}
                    </p>
                    {req.game_url ? (
                      <a
                        href={req.game_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-block max-w-full truncate text-xs text-accent hover:underline"
                      >
                        {req.game_url}
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
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge tone="accent" className="hidden sm:inline-flex">
                      {t("status")}: {ts(req.status)}
                    </Badge>
                    <StatusSelect requestId={req.id} value={req.status} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}