import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { GameForm } from "@/components/admin/game-form";
import { VersionForm } from "@/components/admin/version-form";
import { Card, Badge } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { requireStaff } from "@/lib/auth";
import { deleteVersionAction } from "@/lib/actions/admin";
import { getGameById, getGameVersions } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEditGamePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.games");
  const tv = await getTranslations("admin.versions");
  const tc = await getTranslations("common");

  await requireStaff(locale);

  const game = await getGameById(id);
  if (!game) notFound();

  const versions = await getGameVersions(id);

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
        {game.title_ar} — {t("edit")}
      </h1>

      <div className="grid gap-8 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-5 text-base font-semibold text-foreground">
            {t("edit")}
          </h2>
          <GameForm game={game} />
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-5 text-base font-semibold text-foreground">
              {tv("title")}
            </h2>

            {versions.length > 0 ? (
              <ul className="divide-y divide-border">
                {versions.map((v) => (
                  <li
                    key={v.id}
                    className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Badge tone="accent" className="tabular">
                      v{v.version}
                    </Badge>
                    <span className="tabular flex-1 text-xs text-muted">
                      {formatDate(v.release_date ?? v.created_at, locale)}
                    </span>
                    <span className="tabular text-xs text-muted" dir="ltr">
                      ↓ {v.download_count}
                    </span>
                    <ConfirmDelete
                      label={tc("delete")}
                      onConfirm={async () => {
                        await deleteVersionAction(v.id, locale);
                      }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-6 text-center text-sm text-muted">
                {tv("empty")}
              </p>
            )}

            <div className="mt-6 border-t border-border pt-6">
              <VersionForm gameId={id} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}