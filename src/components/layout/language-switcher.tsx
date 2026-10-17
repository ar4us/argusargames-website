"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

function switchLocalePath(pathname: string, targetLocale: string): string {
  let clean = pathname || "/";
  if (clean.startsWith("/ar/")) clean = clean.slice(3);
  else if (clean === "/ar") clean = "/";
  else if (clean.startsWith("/en/")) clean = clean.slice(3);
  else if (clean === "/en") clean = "/";

  if (!clean.startsWith("/")) clean = "/" + clean;

  if (clean === "/" || clean === "") {
    return targetLocale === "ar" ? "/" : "/en";
  }
  return "/" + targetLocale + clean;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const [currentLocale, setCurrentLocale] = useState<"ar" | "en">("ar");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isEn = window.location.pathname.startsWith("/en");
      setCurrentLocale(isEn ? "en" : "ar");
    }
  }, []);

  const handleSwitch = (target: "ar" | "en") => {
    if (typeof window === "undefined") return;
    if (target === currentLocale) return;

    const newPath = switchLocalePath(window.location.pathname, target);
    const search = window.location.search || "";
    const hash = window.location.hash || "";
    
    try {
      localStorage.setItem("argus_preferred_locale", target);
    } catch {}

    window.location.href = `${newPath}${search}${hash}`;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface p-0.5 shadow-2xs",
        className,
      )}
      aria-label="تغيير اللغة / Switch language"
    >
      <Globe className="ms-1.5 h-3.5 w-3.5 text-muted" aria-hidden />
      <button
        type="button"
        onClick={() => handleSwitch("ar")}
        aria-pressed={currentLocale === "ar"}
        className={cn(
          "cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold uppercase transition-all duration-150",
          currentLocale === "ar"
            ? "bg-accent-soft text-accent shadow-2xs font-bold"
            : "text-muted hover:text-foreground hover:bg-surface-2",
        )}
      >
        ar
      </button>
      <button
        type="button"
        onClick={() => handleSwitch("en")}
        aria-pressed={currentLocale === "en"}
        className={cn(
          "cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold uppercase transition-all duration-150",
          currentLocale === "en"
            ? "bg-accent-soft text-accent shadow-2xs font-bold"
            : "text-muted hover:text-foreground hover:bg-surface-2",
        )}
      >
        en
      </button>
    </div>
  );
}
