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

function readInitialUser(propUser: HeaderUser | null): HeaderUser | null {
  if (propUser) return propUser;
  if (typeof window === "undefined") return null;

  try {
    // 1. Try our fast profile cache first
    const cached = localStorage.getItem("argus_cached_user");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && (parsed.email || parsed.fullName)) {
        return parsed;
      }
    }

    // 2. Fallback: Parse synchronously directly from Supabase session in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          const u = parsed?.user || parsed?.currentSession?.user;
          if (u) {
            const fallbackUser: HeaderUser = {
              email: u.email ?? null,
              fullName:
                u.user_metadata?.full_name ||
                u.user_metadata?.name ||
                u.email?.split("@")[0] ||
                null,
              role: "user",
            };
            return fallbackUser;
          }
        }
      }
    }
  } catch {}

  return null;
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
  // Synchronous initialization prevents any 0ms flicker or flash of unauthenticated state
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(() =>
    readInitialUser(user)
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync route and locale state on page load and on Astro SPA view transitions
  useEffect(() => {
    const handleRouteSync = () => {
      if (typeof window !== "undefined") {
        setPathname(window.location.pathname);
        const isEn = window.location.pathname.startsWith("/en");
        setCurrentLocale(isEn ? "en" : "ar");

        // Verify if cached user exists
        const u = readInitialUser(null);
        if (u) {
          setCurrentUser((prev) => prev || u);
          document.documentElement.classList.add("user-logged-in");
        }
      }
    };

    handleRouteSync();
    document.addEventListener("astro:page-load", handleRouteSync);
    return () => document.removeEventListener("astro:page-load", handleRouteSync);
  }, []);

  // Supabase background session verification & role sync
  useEffect(() => {
    const supabase = createClient();

    const fetchRoleAndSetUser = async (sessionUser: any) => {
      let role: UserRole = "user";
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionUser.id)
          .maybeSingle();

        if (profile?.role) {
          role = profile.role as UserRole;
        }
      } catch {
        // preserve default or current role
      }

      const updatedUser: HeaderUser = {
        email: sessionUser.email ?? null,
        fullName:
          (sessionUser.user_metadata?.full_name ||
            sessionUser.user_metadata?.name ||
            sessionUser.email?.split("@")[0]) ??
          null,
        role,
      };

      setCurrentUser(updatedUser);
      try {
        localStorage.setItem("argus_cached_user", JSON.stringify(updatedUser));
        document.documentElement.classList.add("user-logged-in");
      } catch {}
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        void fetchRoleAndSetUser(session.user);
      } else {
        // If Supabase confirms there's really no session, clear cache
        try {
          localStorage.removeItem("argus_cached_user");
          document.documentElement.classList.remove("user-logged-in");
        } catch {}
        setCurrentUser(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        try {
          localStorage.removeItem("argus_cached_user");
          document.documentElement.classList.remove("user-logged-in");
        } catch {}
        setCurrentUser(null);
      } else if (session?.user) {
        void fetchRoleAndSetUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menus on outside click
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
      localStorage.removeItem("argus_cached_user");
      document.documentElement.classList.remove("user-logged-in");
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
                className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pe-2 ps-1 transition-colors hover:bg-surface-2 cursor-pointer shadow-2xs"
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
            <div className="auth-guest-links hidden items-center gap-2 sm:flex">
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
            {currentUser ? (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {initial}
                  </span>
                  <span className="truncate text-xs font-medium text-foreground">
                    {currentUser.fullName || currentUser.email}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={isEn ? "/en/profile" : "/ar/profile"}
                    onClick={() => setMobileOpen(false)}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    {isEn ? "Profile" : "الملف الشخصي"}
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    {isEn ? "Sign out" : "تسجيل الخروج"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-guest-links mt-3 grid grid-cols-2 gap-2">
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
            )}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
