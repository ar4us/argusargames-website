"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark" | "system";

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "فاتح" },
  { value: "dark", icon: Moon, label: "داكن" },
  { value: "system", icon: Monitor, label: "النظام" },
];

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("theme") as Theme) || "system";
    setThemeState(stored);
  }, []);

  const applyTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem("theme", next);
      const isDark =
        next === "dark" ||
        (next === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.dataset.theme = next;
    } catch (e) {
      console.error("Theme toggle error:", e);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = (localStorage.getItem("theme") as Theme) || "system";
      if (current === "system") {
        document.documentElement.classList.toggle("dark", mq.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted]);

  return (
    <div
      role="radiogroup"
      aria-label="تبديل المظهر"
      className="inline-flex items-center rounded-full border border-border bg-surface p-0.5 select-none"
    >
      {options.map(({ value, icon: Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => applyTheme(value)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors cursor-pointer",
              active
                ? "bg-accent-soft text-accent"
                : "text-muted hover:text-foreground hover:bg-surface-2",
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
