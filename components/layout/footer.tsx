import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/brand/logo";
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
    <footer className="mt-24 border-t border-border bg-surface">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-bold tracking-tight">
              {settings.site_name_en}
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            {t("footer.tagline")}
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t("footer.browse")}
          </p>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-fit text-sm text-foreground transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t("footer.community")}
          </p>
          <SocialLinks settings={settings} size="sm" />
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-border py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {settings.site_name_ar} — {t("footer.rights")}
        </p>
        <p>{t("footer.madeWith")}</p>
      </Container>
    </footer>
  );
}
