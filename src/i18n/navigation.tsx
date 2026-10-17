import React from "react";
import { useLocale } from "@/lib/i18n-context";

export function formatHref(href: any, currentLocale: string): string {
  let path = "";
  if (typeof href === "string") {
    path = href;
  } else if (href && typeof href === "object") {
    const pathname = href.pathname || "";
    const searchParams = href.query
      ? new URLSearchParams(href.query).toString()
      : "";
    path = `${pathname}${searchParams ? `?${searchParams}` : ""}`;
  } else {
    path = "/";
  }

  if (path.startsWith("/")) {
    if (!path.startsWith("/ar") && !path.startsWith("/en")) {
      const cleanPath = path === "/" ? "" : path;
      return `/${currentLocale}${cleanPath}`;
    }
  }
  return path;
}

export function Link({
  href,
  children,
  className,
  ...props
}: any) {
  const locale = useLocale();
  const resolvedHref = formatHref(href, locale);

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
  const locale = useLocale();
  return {
    push: (target: any) => {
      if (typeof window !== "undefined") {
        const url = formatHref(target, locale);
        window.location.href = url;
      }
    },
    replace: (target: any) => {
      if (typeof window !== "undefined") {
        const url = formatHref(target, locale);
        window.location.replace(url);
      }
    },
    refresh: () => {
      // Safe no-op in Astro static site to prevent infinite reload loops
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
