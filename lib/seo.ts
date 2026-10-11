import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Per-page hreflang + canonical alternates for the two locales. */
export function alternates(locale: string, path = ""): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${clean}`,
    languages: {
      ar: `/ar${clean}`,
      en: `/en${clean}`,
      "x-default": `/ar${clean}`,
    },
  };
}

export function absoluteUrl(path = ""): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
