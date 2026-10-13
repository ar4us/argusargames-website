import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const FALLBACK_SUPABASE_URL = "https://knzxcacncetecdokothd.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuenhjYWNuY2V0ZWNkb2tvdGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDM5MTQsImV4cCI6MjEwNjgxOTkxNH0.VqA0RzBXe_0KpyPUlgnRaDXW3PXXGGN7mCkS1k3zDEU";

// Server-side Supabase client. `cookies()` is async in Next.js 16.
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component: safe to ignore, proxy refreshes.
        }
      },
    },
  });
}

// True only when Supabase env is configured; lets the UI show a setup hint
// instead of crashing before the project has been wired up.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL) &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY),
  );
}
