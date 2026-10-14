import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// In Next.js 16 the `middleware` convention is renamed to `proxy` (Node runtime).
const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1) Locale routing (redirects / -> /ar, keeps the prefix).
  const response = intlMiddleware(request);

  // 2) Refresh the Supabase auth session ONLY if an auth cookie is actually present.
  // This avoids a blocking HTTP call to Supabase on every single anonymous request!
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"),
  );

  if (hasAuthCookie) {
    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://knzxcacncetecdokothd.supabase.co";
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuenhjYWNuY2V0ZWNkb2tvdGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDM5MTQsImV4cCI6MjEwNjgxOTkxNH0.VqA0RzBXe_0KpyPUlgnRaDXW3PXXGGN7mCkS1k3zDEU";

    if (url && key) {
      try {
        const supabase = createServerClient(url, key, {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value),
              );
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options),
              );
            },
          },
        });
        await supabase.auth.getUser();
      } catch {
        // Safe to ignore in proxy
      }
    }
  }

  // 3) Cloudflare Edge CDN Caching for public GET routes
  const pathname = request.nextUrl.pathname;
  const isPrivate =
    hasAuthCookie ||
    pathname.includes("/admin") ||
    pathname.includes("/profile") ||
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/reset-password") ||
    pathname.includes("/forgot-password");

  if (!isPrivate && request.method === "GET") {
    // Tell Cloudflare's Edge to cache the HTML for 120s and serve stale up to 24h
    // This reduces Worker CPU time and database queries to near ZERO for visitors!
    response.headers.set(
      "CDN-Cache-Control",
      "public, max-age=120, stale-while-revalidate=86400",
    );
  }

  return response;
}

export const config = {
  // Skip API routes, auth callback, Next internals and static files.
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
