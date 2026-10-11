import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Divider } from "@/components/auth/divider";
import { SetupNotice } from "@/components/auth/setup-notice";
import { Link } from "@/i18n/navigation";
import { getProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("loginTitle") };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  const profile = await getProfile();
  if (profile) redirect(`/${locale}`);

  return (
    <AuthShell title={t("loginTitle")} subtitle={t("loginSubtitle")}>
      {isSupabaseConfigured() ? (
        <>
          <SocialButtons />
          <Divider label={t("orContinueWith")} />
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted">
            {t("noAccount")}{" "}
            <Link href="/register" className="font-medium text-accent hover:underline">
              {t("register")}
            </Link>
          </p>
        </>
      ) : (
        <SetupNotice />
      )}
    </AuthShell>
  );
}