"use client";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User as UserIcon,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeaderUser {
  email: string | null;
  fullName: string | null;
  role: UserRole;
}

export function Header({
  user,
  brandName,
}: {
  user: HeaderUser | null;
  brandName: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync client session & detect OAuth code in URL
  useEffect(() => {
    setCurrentUser(user);
    const supabase = createClient();

    // Check client session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          email: session.user.email ?? null,
          fullName: (session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0]) ?? null,
          role: "admin",
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          email: session.user.email ?? null,
          fullName: (session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0]) ?? null,
          role: "admin",
        });
        router.refresh();
      } else {
        setCurrentUser(null);
      }
    });

    // If there is an auth code in the current URL, exchange it and clean the URL
    if (typeof window !== "undefined" && window.location.search.includes("code=")) {
      router.refresh();
    }

    return () => subscription.unsubscribe();
  }, [user, router]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close the mobile panel whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname, locale]);

  const isStaff = currentUser?.role === "admin" || currentUser?.role === "editor";

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/games", label: t("games") },
    { href: "/request", label: t("request") },
    ...(isStaff ? [{ href: "/admin", label: t("admin") }] : []),
  ] as const;

  const initial = (currentUser?.fullName || currentUser?.email || "?").slice(0, 1).toUpperCase();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch {
      // ignore
    }
    setMenuOpen(false);
    router.replace("/");
    router.refresh();
  };

  const navLink = (href: string, label: string, onClick?: () => void) => {
    const active =
      href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200",
          active
            ? "bg-[#00ff66] text-[#020703] shadow-md shadow-[#00ff66]/25"
            : "text-[#789d84] hover:text-[#00ff66] hover:bg-[#07170c]",
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#132d19] bg-[#020503]/90 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label={brandName}>
            <Wordmark name={brandName} />
          </Link>
          <nav className="hidden items-center gap-1.5 md:flex bg-[#050e07] p-1 rounded-2xl border border-[#132d19]">
            {navItems.map((item) => navLink(item.href, item.label))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pe-2 ps-1 transition-colors hover:bg-surface-2"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {initial}
                </span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>
              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute end-0 mt-2 w-56 overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface py-1 shadow-lg shadow-black/5"
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {currentUser.fullName || currentUser.email}
                    </p>
                    <p className="truncate text-xs text-muted">{currentUser.email}</p>
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <Link
                    href="/profile"
                    role="menuitem"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface-2"
                  >
                    <UserIcon className="h-4 w-4 text-muted" />
                    {t("profile")}
                  </Link>
                  {isStaff ? (
                    <Link
                      href="/admin"
                      role="menuitem"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface-2"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted" />
                      {t("admin")}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-surface-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ variant: "primary", size: "sm" })}
              >
                {t("register")}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navItems.map((item) =>
              navLink(item.href, item.label, () => setMobileOpen(false)),
            )}
            <div className="mt-2 flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {!currentUser ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className={buttonVariants({ variant: "primary" })}
                >
                  {t("register")}
                </Link>
              </div>
            ) : null}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
