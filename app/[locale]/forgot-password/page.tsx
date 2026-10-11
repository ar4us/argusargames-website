import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";
import { SetupNotice } from "@/components/auth/setup-notice";
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
  return { title: t("forgotTitle") };
}

export default async function ForgotPasswordPage({
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
    <AuthShell title={t("forgotTitle")} subtitle={t("forgotSubtitle")}>
      {isSupabaseConfigured() ? <ForgotForm /> : <SetupNotice />}
    </AuthShell>
  );
}