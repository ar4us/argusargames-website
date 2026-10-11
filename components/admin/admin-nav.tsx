"use client";

import { Gamepad2, Inbox, LayoutDashboard, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  const items = [
    { href: "/admin", label: t("dashboard"), Icon: LayoutDashboard, exact: true },
    { href: "/admin/games", label: t("games"), Icon: Gamepad2 },
    { href: "/admin/requests", label: t("requests"), Icon: Inbox },
    { href: "/admin/settings", label: t("settings"), Icon: Settings },
  ];

  return (
    <nav className="flex flex-wrap gap-1.5 lg:flex-col" aria-label="admin nav">
      {items.map(({ href, label, Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-[var(--radius-control)] px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent-soft text-accent"
                : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}