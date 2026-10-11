import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { Container } from "@/components/ui/container";
import { getProfile, isStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
  };
}

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const profile = await getProfile();
  if (!profile) redirect(`/${locale}/login`);

  const staff = isStaff(profile.role);

  return (
    <Container className="py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <a
          href={`/${locale}`}
          className="text-sm font-medium text-muted hover:text-accent"
        >
          {t("backToSite")} →
        </a>
      </header>

      {staff ? (
        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          <aside>
            <AdminNav />
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      ) : (
        <div className="rounded-[var(--radius-card)] border border-border bg-surface px-6 py-16 text-center">
          <p className="text-lg font-semibold text-foreground">
            {t("forbidden")}
          </p>
          <a
            href={`/${locale}`}
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            {t("backToSite")}
          </a>
        </div>
      )}
    </Container>
  );
}