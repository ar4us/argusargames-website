import Image from "next/image";
import { Link2, Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DeleteGameButton } from "@/components/admin/confirm-delete";
import { LogoMark } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { requireStaff } from "@/lib/auth";
import { deleteGameAction } from "@/lib/actions/admin";
import { getAllGamesForAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminGamesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.games");
  const ta = await getTranslations("admin");
  const tc = await getTranslations("common");

  await requireStaff(locale);
  const games = await getAllGamesForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <Link href="/admin/games/new" className={buttonVariants({ size: "sm" })}>
          <Plus className="h-4 w-4" />
          {t("add")}
        </Link>
      </div>

      {games.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-10 text-center text-sm text-muted">
          {t("empty")}
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
          {games.map((game) => (
            <li
              key={game.id}
              className="flex flex-wrap items-center gap-4 px-4 py-3 sm:flex-nowrap"
            >
              <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-surface-2">
                {game.cover_url ? (
                  <Image src={game.cover_url} alt="" fill sizes="36px" className="object-cover" />
                ) : (
                  <LogoMark className="absolute inset-0 m-auto h-5 w-5 opacity-40" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {game.title_ar}
                  {game.title_en && game.title_en !== game.title_ar ? (
                    <span className="font-normal text-muted">
                      {" "}· {game.title_en}
                    </span>
                  ) : null}
                </p>
                <p className="tabular truncate text-xs text-muted" dir="ltr">
                  /games/{game.slug}
                </p>
              </div>
              <Badge tone={game.published ? "success" : "neutral"}>
                {game.published ? tc("yes") : tc("no")}
              </Badge>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/games/${game.id}`}
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  <Link2 className="h-3.5 w-3.5 rtl:hidden" />
                  <Link2 className="hidden h-3.5 w-3.5 rtl:block" />
                  {t("edit")}
                </Link>
                <DeleteGameButton gameId={game.id} locale={locale} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/admin"
        className="mt-6 inline-block text-sm text-muted hover:text-accent"
      >
        ← {ta("backToSite")}
      </Link>
    </div>
  );
}