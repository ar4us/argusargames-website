import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequestForm } from "@/components/request/request-form";
import { RequestList } from "@/components/request/request-list";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getUser } from "@/lib/auth";
import {
  getGames,
  getMyRequests,
  getMyVotes,
  getTopRequests,
} from "@/lib/queries";
import { alternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "request" });
  return {
    title: "اطلب تعريب أو بلّغ عن خطأ - ArgusArGames",
    description: "مركز طلبات التعريب وتحديث الباتشات والإبلاغ عن الأخطاء والمشاكل لمجتمع اللاعبين العرب",
    alternates: alternates(locale, "/request"),
  };
}

export default async function RequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("request");

  const user = await getUser();
  const [top, my, myVotes, gamesRes] = await Promise.all([
    getTopRequests(15),
    user ? getMyRequests(user.id) : Promise.resolve([]),
    user ? getMyVotes(user.id) : Promise.resolve([]),
    getGames({ perPage: 100 }),
  ]);

  return (
    <Container className="py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          مركز طلبات التعريب والبلاغات
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          يمكنك هنا طلب تعريب لعبة جديدة، أو طلب تحديث لتعريب حالي بعد نزول باتش رسمي، أو الإبلاغ عن أي خطأ لمساعدتنا في إصلاحه.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        {/* Form + my requests */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-foreground">
                إرسال طلب جديد أو بلاغ
              </h2>
              {user ? (
                <div className="mt-4">
                  <RequestForm games={gamesRes.games} />
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-start gap-3 rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-6">
                  <p className="text-sm text-muted">{t("loginRequired")}</p>
                  <Link
                    href="/login"
                    className={buttonVariants({ size: "sm" })}
                  >
                    {t("loginCta")}
                  </Link>
                </div>
              )}
            </Card>

            {user && my.length > 0 ? (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  {t("myRequests")}
                </h3>
                <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
                  {my.map((req) => (
                    <li key={req.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="min-w-0 truncate text-sm font-medium text-foreground">
                        {req.game_name}
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {t(`status.${req.status}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {user && my.length === 0 ? (
              <p className="mt-6 text-sm text-muted">{t("noRequests")}</p>
            ) : null}
          </div>
        </div>

        {/* Top requests */}
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
            {t("topRequests")}
          </h2>
          <RequestList
            requests={top}
            myVotes={myVotes}
            locale={locale}
            empty="noTopRequests"
          />
        </div>
      </div>
    </Container>
  );
}