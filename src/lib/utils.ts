import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocalized = <T>(
  row: T,
  base: string,
  locale: string,
): string => {
  const record = row as Record<string, unknown>;
  const localized = record[`${base}_${locale}`];
  const fallback = record[`${base}_${locale === "ar" ? "en" : "ar"}`];
  return (localized as string) || (fallback as string) || "";
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatNumber(value: number, _locale?: string): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(
  value: string | null | undefined,
  locale: string,
): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}
