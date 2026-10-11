import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { Divider } from "@/components/auth/divider";
import { RegisterForm } from "@/components/auth/register-form";
import { SetupNotice } from "@/components/auth/setup-notice";
import { SocialButtons } from "@/components/auth/social-buttons";
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
  return { title: t("registerTitle") };
}

export default async function RegisterPage({
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
    <AuthShell title={t("registerTitle")} subtitle={t("registerSubtitle")}>
      {isSupabaseConfigured() ? (
        <>
          <SocialButtons />
          <Divider label={t("orContinueWith")} />
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-muted">
            {t("haveAccount")}{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              {t("login")}
            </Link>
          </p>
        </>
      ) : (
        <SetupNotice />
      )}
    </AuthShell>
  );
}