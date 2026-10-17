import arMessages from "../messages/ar.json";
import enMessages from "../messages/en.json";

export type Locale = "ar" | "en";
export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";

const messages: Record<Locale, any> = {
  ar: arMessages,
  en: enMessages,
};

export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getTranslations(locale: Locale = "ar") {
  const currentMessages = messages[locale] || messages.ar;

  return function t(path: string, values?: Record<string, string | number>): string {
    const keys = path.split(".");
    let current: any = currentMessages;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to ar
        let fallback: any = messages.ar;
        for (const fKey of keys) {
          if (fallback && typeof fallback === "object" && fKey in fallback) {
            fallback = fallback[fKey];
          } else {
            fallback = undefined;
            break;
          }
        }
        current = fallback !== undefined ? fallback : path;
        break;
      }
    }

    if (typeof current !== "string") {
      return String(current ?? path);
    }

    let result = current;
    if (values) {
      for (const [k, v] of Object.entries(values)) {
        result = result.replace(new RegExp(`{${k}}`, "g"), String(v));
      }
    }
    return result;
  };
}
