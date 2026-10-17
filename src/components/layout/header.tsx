"use client";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User as UserIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/logo";
import { HeaderSearch } from "@/components/layout/header-search";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
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
  locale: initialLocale = "ar",
}: {
  user: HeaderUser | null;
  brandName: string;
  locale?: "ar" | "en";
}) {
  const [currentLocale, setCurrentLocale] = useState<"ar" | "en">(initialLocale);
  const [pathname, setPathname] = useState("");
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
      const isEn = window.location.pathname.startsWith("/en");
      setCurrentLocale(isEn ? "en" : "ar");
    }
  }, []);

  useEffect(() => {
    setCurrentUser(user);
    const supabase = createClient();

    const fetchRoleAndSetUser = async (sessionUser: any) => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionUser.id)
          .maybeSingle();

        const role = (profile?.role as UserRole) || "user";
        setCurrentUser({
          email: sessionUser.email ?? null,
          fullName:
            (sessionUser.user_metadata?.full_name ||
              sessionUser.user_metadata?.name ||
              sessionUser.email?.split("@")[0]) ??
            null,
          role,
        });
      } catch {
        setCurrentUser({
          email: sessionUser.email ?? null,
          fullName:
            (sessionUser.user_metadata?.full_name ||
              sessionUser.user_metadata?.name ||
              sessionUser.email?.split("@")[0]) ??
            null,
          role: "user",
        });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        void fetchRoleAndSetUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void fetchRoleAndSetUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [user]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isStaff = currentUser?.role === "admin" || currentUser?.role === "editor";
  const isEn = currentLocale === "en";

  const navItems = [
    { href: isEn ? "/en" : "/", label: isEn ? "Home" : "الرئيسية" },
    { href: isEn ? "/en/games" : "/ar/games", label: isEn ? "Games" : "التعريبات" },
    { href: isEn ? "/en/request" : "/ar/request", label: isEn ? "Requests" : "طلبات التعريب" },
    ...(isStaff ? [{ href: isEn ? "/en/admin" : "/ar/admin", label: isEn ? "Dashboard" : "لوحة الإدارة" }] : []),
  ];

  const initial = (currentUser?.fullName || currentUser?.email || "?")
    .slice(0, 1)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch {
      // ignore
    }
    setMenuOpen(false);
    if (typeof window !== "undefined") {
      window.location.href = isEn ? "/en" : "/";
    }
  };

  const navLink = (href: string, label: string, onClick?: () => void) => {
    const active =
      href === "/" || href === "/en"
        ? pathname === href
        : pathname.startsWith(href);

    return (
      <a
        key={href}
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={cn(
          "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
          active
            ? "bg-surface-2 text-foreground font-semibold"
            : "text-muted hover:text-foreground hover:bg-surface-2/60",
        )}
      >
        {label}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Brand & Nav links */}
        <div className="flex items-center gap-8">
          <a href={isEn ? "/en" : "/"} aria-label={brandName}>
            <Wordmark name={brandName || "Argus Games"} />
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => navLink(item.href, item.label))}
          </nav>
        </div>

        {/* Search shortcut & controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <HeaderSearch />
          </div>

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
                className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pe-2 ps-1 transition-colors hover:bg-surface-2 cursor-pointer"
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
                  <a
                    href={isEn ? "/en/profile" : "/ar/profile"}
                    role="menuitem"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface-2"
                  >
                    <UserIcon className="h-4 w-4 text-muted" />
                    {isEn ? "Profile" : "الملف الشخصي"}
                  </a>
                  {isStaff ? (
                    <a
                      href={isEn ? "/en/admin" : "/ar/admin"}
                      role="menuitem"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface-2"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted" />
                      {isEn ? "Dashboard" : "لوحة الإدارة"}
                    </a>
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-surface-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    {isEn ? "Sign out" : "تسجيل الخروج"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <a
                href={isEn ? "/en/login" : "/ar/login"}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                {isEn ? "Sign in" : "تسجيل الدخول"}
              </a>
              <a
                href={isEn ? "/en/register" : "/ar/register"}
                className={buttonVariants({ variant: "primary", size: "sm" })}
              >
                {isEn ? "Create account" : "إنشاء حساب"}
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={isEn ? "Menu" : "القائمة"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div className="border-t border-border bg-surface md:hidden">
          <Container className="flex flex-col gap-2 py-3">
            <div className="mb-1">
              <HeaderSearch isMobile onSelect={() => setMobileOpen(false)} />
            </div>
            {navItems.map((item) =>
              navLink(item.href, item.label, () => setMobileOpen(false)),
            )}
            <div className="mt-2 flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {!currentUser ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={isEn ? "/en/login" : "/ar/login"}
                  onClick={() => setMobileOpen(false)}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {isEn ? "Sign in" : "تسجيل الدخول"}
                </a>
                <a
                  href={isEn ? "/en/register" : "/ar/register"}
                  onClick={() => setMobileOpen(false)}
                  className={buttonVariants({ variant: "primary" })}
                >
                  {isEn ? "Create account" : "إنشاء حساب"}
                </a>
              </div>
            ) : null}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
