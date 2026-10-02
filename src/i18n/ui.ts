export const ui = {
  ar: {
    "nav.home": "الرئيسية",
    "nav.localizations": "التعريبات",
    "nav.about": "عن الموقع",
    "nav.lang": "English",
    "nav.lang_code": "en",

    "hero.badge": "تعريبات احترافية",
    "hero.title": "ألعابك",
    "hero.title_highlight": "بالعربي",
    "hero.subtitle": "نُعرِّب الألعاب التي لا تدعم اللغة العربية — مجاناً وبجودة عالية.",
    "hero.cta_primary": "تصفح التعريبات",
    "hero.cta_secondary": "عن المشروع",

    "games.title": "أحدث التعريبات",
    "games.all": "جميع التعريبات",
    "games.empty": "لا توجد تعريبات بعد.",
    "games.status.complete": "مكتمل",
    "games.status.beta": "تجريبي",
    "games.status.partial": "جزئي",
    "games.download": "تحميل التعريب",
    "games.version": "الإصدار",
    "games.size": "الحجم",
    "games.platforms": "المنصات",
    "games.released": "تاريخ الإصدار",
    "games.install": "دليل التثبيت",

    "footer.rights": "جميع الحقوق محفوظة",
    "footer.disclaimer": "هذا الموقع غير رسمي. جميع التعريبات لأغراض شخصية وتعليمية.",

    "meta.site_name": "بالعربي Games",
    "meta.description": "تعريبات احترافية للألعاب التي لا تدعم اللغة العربية.",
  },
  en: {
    "nav.home": "Home",
    "nav.localizations": "Localizations",
    "nav.about": "About",
    "nav.lang": "العربية",
    "nav.lang_code": "ar",

    "hero.badge": "Professional Localizations",
    "hero.title": "Your Games",
    "hero.title_highlight": "In Arabic",
    "hero.subtitle": "We localize games that don't support Arabic — for free, at the highest quality.",
    "hero.cta_primary": "Browse Localizations",
    "hero.cta_secondary": "About the Project",

    "games.title": "Latest Localizations",
    "games.all": "All Localizations",
    "games.empty": "No localizations yet.",
    "games.status.complete": "Complete",
    "games.status.beta": "Beta",
    "games.status.partial": "Partial",
    "games.download": "Download Patch",
    "games.version": "Version",
    "games.size": "Size",
    "games.platforms": "Platforms",
    "games.released": "Release Date",
    "games.install": "Install Guide",

    "footer.rights": "All rights reserved",
    "footer.disclaimer": "This is an unofficial site. All patches are for personal and educational use.",

    "meta.site_name": "بالعربي Games",
    "meta.description": "Professional Arabic localizations for games without Arabic support.",
  },
} as const;

export type Lang = keyof typeof ui;
export type UIKey = keyof typeof ui.ar;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as Lang;
  return "ar";
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui["ar"][key] ?? key;
  };
}
