import { getTranslations } from "next-intl/server";
import { Wordmark } from "@/components/brand/logo";
import { SocialLinks } from "@/components/layout/social-links";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import type { SiteSettings } from "@/lib/types";

export async function Footer({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  const nav = [
    { href: "/games", label: t("nav.games") },
    { href: "/request", label: t("nav.request") },
    { href: "/profile", label: t("nav.profile") },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-block">
            <Wordmark name={settings.site_name_en || "Argus Games"} />
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted leading-relaxed">
            منصة عربية مستقلة تقدم تعريبات ألعاب الفيديو وشروحات التثبيت لمجتمع اللاعبين العرب.
          </p>
        </div>

        <nav className="flex flex-col gap-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
            {t("footer.browse")}
          </p>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-fit text-sm text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
            {t("footer.community")}
          </p>
          <SocialLinks settings={settings} size="sm" />
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {settings.site_name_en || "Argus Games"} — جميع الحقوق محفوظة.</p>
        <p>بنيت للاعبين العرب بكل حب</p>
      </Container>
    </footer>
  );
}
