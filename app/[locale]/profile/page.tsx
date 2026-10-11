import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getProfile, requireUser } from "@/lib/auth";
import { getMyRequests } from "@/lib/queries";
import { alternates } from "@/lib/seo";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternates(locale, "/profile"),
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("profile");
  const ts = await getTranslations("status");

  const user = await requireUser(locale);
  const profile = await getProfile();
  const requests = await getMyRequests(user.id);

  const name = profile?.full_name || user.email?.split("@")[0] || t("roleUser");
  const roleLabel =
    profile?.role === "admin"
      ? t("roleAdmin")
      : profile?.role === "editor"
        ? t("roleEditor")
        : t("roleUser");

  return (
    <Container className="py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Account card */}
        <section className="lg:col-span-1">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            <div className="flex items-center gap-3 border-b border-border bg-surface-2 px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <dl className="divide-y divide-border">
              <Row label={t("role")} children={<Badge tone="accent">{roleLabel}</Badge>} />
              <Row label={t("joined")} children={<span className="tabular text-sm text-foreground">{formatDate(profile?.created_at ?? user.created_at, locale)}</span>} />
            </dl>
          </div>
        </section>

        {/* My requests */}
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
            {t("myRequests")}
          </h2>
          {requests.length > 0 ? (
            <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
              {requests.map((req) => (
                <li key={req.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {req.game_name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      <span className="tabular">
                        {formatNumber(req.vote_count, locale)}
                      </span>{" "}
                      {ts(`${req.status}`)}
                    </p>
                  </div>
                  <Badge tone="neutral">{ts(`${req.status}`)}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-10 text-center text-sm text-muted">
              {t("noRequests")}
            </p>
          )}
        </section>
      </div>
    </Container>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}