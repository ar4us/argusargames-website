export const routing = {
  locales: ["ar", "en"] as const,
  defaultLocale: "ar" as const,
  localePrefix: "always" as const,
};

export type Locale = (typeof routing.locales)[number];

export const localeLabels: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export const dir = (locale: Locale): "rtl" | "ltr" =>
  locale === "ar" ? "rtl" : "ltr";
