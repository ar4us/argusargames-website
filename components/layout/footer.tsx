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
    <footer className="mt-24 border-t border-[#132d19] bg-[#020503]">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-block">
            <Wordmark name={settings.site_name_en || "ArgusOs"} />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-[#789d84] leading-relaxed">
            {t("footer.tagline") || "الموقع العربي الأول المتخصص في تعريب ألعاب الفيديو بأعلى جودة واحترافية."}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#00ff66]/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-pulse" />
            <span>ARGUSOS • LOCALIZATION HUB</span>
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ff66]">
            {t("footer.browse")}
          </p>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-fit text-sm text-[#a4c7af] transition-colors hover:text-[#00ff66]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ff66]">
            {t("footer.community")}
          </p>
          <SocialLinks settings={settings} size="sm" />
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-[#132d19] py-6 text-xs font-mono text-[#5f826a] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} ArgusOs تعريب — جميع الحقوق محفوظة.
        </p>
        <p className="text-[#00ff66]/80">
          DESIGNED FOR GAMERS • POWERED BY ARGUSOS
        </p>
      </Container>
    </footer>
  );
}
