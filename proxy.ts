import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// In Next.js 16 the `middleware` convention is renamed to `proxy` (Node runtime).
const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1) Locale routing (redirects / -> /ar, keeps the prefix).
  const response = intlMiddleware(request);

  // 2) Refresh the Supabase auth session so Server Components see fresh tokens.
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://knzxcacncetecdokothd.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuenhjYWNuY2V0ZWNkb2tvdGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDM5MTQsImV4cCI6MjEwNjgxOTkxNH0.VqA0RzBXe_0KpyPUlgnRaDXW3PXXGGN7mCkS1k3zDEU";
  if (!url || !key) return response;

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

  // Do not remove: keeps the session alive for Server Components.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Skip API routes, auth callback, Next internals and static files.
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
