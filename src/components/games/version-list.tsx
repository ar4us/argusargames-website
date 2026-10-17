"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DownloadButton } from "@/components/games/download-button";
import { Badge } from "@/components/ui/card";
import type { GameVersion } from "@/lib/types";
import { cn, formatDate, formatNumber, getLocalized } from "@/lib/utils";

function VersionRow({
  version,
  locale,
  featured = false,
}: {
  version: GameVersion;
  locale: string;
  featured?: boolean;
}) {
  const t = useTranslations("game");
  const notes = getLocalized(version, "notes", locale);

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border p-4 sm:p-5",
        featured
          ? "border-accent/40 bg-accent-soft"
          : "border-border bg-surface",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={featured ? "accent" : "neutral"} className="tabular">
              v{version.version}
            </Badge>
            {featured ? <Badge tone="accent">{t("latestVersion")}</Badge> : null}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(version.release_date ?? version.created_at, locale)}
            </span>
            <span className="tabular text-xs text-muted">
              {formatNumber(version.download_count, locale)} {t("downloads")}
            </span>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {notes || t("noNotes")}
          </p>
        </div>

        <DownloadButton
          versionId={version.id}
          downloadUrl={version.download_url}
          count={version.download_count}
          locale={locale}
          label={featured ? t("downloadNow") : t("download")}
          variant={featured ? "primary" : "secondary"}
          size={featured ? "lg" : "md"}
          showCount={false}
          className="shrink-0"
        />
      </div>
    </div>
  );
}

export function VersionList({
  versions,
  locale,
}: {
  versions: GameVersion[];
  locale: string;
}) {
  const t = useTranslations("game");
  const [open, setOpen] = useState(false);

  if (versions.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-8 text-center text-sm text-muted">
        {t("noVersions")}
      </p>
    );
  }

  const [latest, ...older] = versions;

  return (
    <div className="space-y-3">
      <VersionRow version={latest} locale={locale} featured />

      {older.length > 0 ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-[var(--radius-control)] border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
          >
            <span>
              {t("olderVersions")}{" "}
              <span className="tabular text-muted">({older.length})</span>
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
          {open ? (
            <div className="space-y-3">
              {older.map((v) => (
                <VersionRow key={v.id} version={v} locale={locale} />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
