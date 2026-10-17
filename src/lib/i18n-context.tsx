import React, { createContext, useContext } from "react";
import arMessages from "../messages/ar.json";
import enMessages from "../messages/en.json";

const messages: Record<string, any> = {
  ar: arMessages,
  en: enMessages,
};

interface I18nContextType {
  locale: "ar" | "en";
}

const I18nContext = createContext<I18nContextType>({ locale: "ar" });

export function I18nProvider({
  locale = "ar",
  children,
}: {
  locale?: "ar" | "en";
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale(): "ar" | "en" {
  const ctx = useContext(I18nContext);
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.startsWith("/en")) return "en";
    if (path.startsWith("/ar")) return "ar";
  }
  return ctx?.locale || "ar";
}

export function useTranslations(namespace?: string) {
  const locale = useLocale();
  const currentMessages = messages[locale] || messages.ar;

  return function t(key?: string, values?: Record<string, string | number>): string {
    if (!key) return "";
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const parts = fullKey.split(".");
    let cur: any = currentMessages;

    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) {
        cur = cur[p];
      } else {
        let fallback: any = messages.ar;
        for (const fKey of fullKey.split(".")) {
          if (fallback && typeof fallback === "object" && fKey in fallback) {
            fallback = fallback[fKey];
          } else {
            fallback = undefined;
            break;
          }
        }
        cur = fallback !== undefined ? fallback : key;
        break;
      }
    }

    let res = typeof cur === "string" ? cur : key;
    if (values) {
      for (const [k, v] of Object.entries(values)) {
        res = res.replace(new RegExp(`{${k}}`, "g"), String(v));
      }
    }
    return res;
  };
}

export async function getTranslations(opts?: any) {
  const ns = typeof opts === "string" ? opts : opts?.namespace;
  return useTranslations(ns);
}

export async function getMessages() {
  return messages;
}

export function setRequestLocale(_locale: string) {}
export function hasLocale(_locales: any, _l: any) {
  return true;
}
export function NextIntlClientProvider({ children }: any) {
  return children;
}
