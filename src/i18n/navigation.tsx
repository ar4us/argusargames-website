import React from "react";
import { useLocale } from "@/lib/i18n-context";

export function formatHref(href: any, currentLocale: string): string {
  let path = "";
  let search = "";
  if (typeof href === "string") {
    const [p, s] = href.split("?");
    path = p || "/";
    if (s) search = `?${s}`;
  } else if (href && typeof href === "object") {
    path = href.pathname || "/";
    if (href.query) {
      search = `?${new URLSearchParams(href.query).toString()}`;
    }
  } else {
    path = "/";
  }

  // Strip existing locale prefix if already present
  let clean = path;
  if (clean.startsWith("/ar/")) clean = clean.slice(3);
  else if (clean === "/ar") clean = "/";
  else if (clean.startsWith("/en/")) clean = clean.slice(3);
  else if (clean === "/en") clean = "/";

  if (!clean.startsWith("/")) clean = `/${clean}`;

  let targetPath = "";
  if (clean === "/" || clean === "") {
    targetPath = currentLocale === "ar" ? "/" : "/en";
  } else {
    targetPath = `/${currentLocale}${clean}`;
  }

  return `${targetPath}${search}`;
}

export function Link({
  href,
  children,
  className,
  locale: overrideLocale,
  ...props
}: any) {
  const currentLocale = useLocale();
  const activeLocale = overrideLocale || currentLocale;
  const resolvedHref = formatHref(href, activeLocale);

  return (
    <a href={resolvedHref} className={className} {...props}>
      {children}
    </a>
  );
}

export function usePathname(): string {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/";
}

export function useRouter() {
  const currentLocale = useLocale();
  return {
    push: (target: any, options?: { locale?: string }) => {
      if (typeof window !== "undefined") {
        const targetLocale = options?.locale || currentLocale;
        const url = formatHref(target, targetLocale);
        window.location.href = url;
      }
    },
    replace: (target: any, options?: { locale?: string }) => {
      if (typeof window !== "undefined") {
        const targetLocale = options?.locale || currentLocale;
        const url = formatHref(target, targetLocale);
        window.location.replace(url);
      }
    },
    refresh: () => {
      // Safe no-op in Astro static site
    },
    back: () => {
      if (typeof window !== "undefined") window.history.back();
    },
  };
}

export function redirect(url: string) {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
}

export function getPathname({ href, locale }: { href: string; locale: string }) {
  return formatHref(href, locale);
}
