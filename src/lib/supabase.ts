import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const FALLBACK_SUPABASE_URL = "https://knzxcacncetecdokothd.supabase.co";
export const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuenhjYWNuY2V0ZWNkb2tvdGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDM5MTQsImV4cCI6MjEwNjgxOTkxNH0.VqA0RzBXe_0KpyPUlgnRaDXW3PXXGGN7mCkS1k3zDEU";

const getEnv = (key: string, fallback: string) => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key]) return process.env[key]!;
    if (process.env[`NEXT_${key}`]) return process.env[`NEXT_${key}`]!;
  }
  // Vite / Astro env
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv) {
      if (metaEnv[key]) return metaEnv[key];
      if (metaEnv[`NEXT_${key}`]) return metaEnv[`NEXT_${key}`];
    }
  } catch {}
  return fallback;
};

export const SUPABASE_URL = getEnv("PUBLIC_SUPABASE_URL", FALLBACK_SUPABASE_URL);
export const SUPABASE_ANON_KEY = getEnv("PUBLIC_SUPABASE_ANON_KEY", FALLBACK_SUPABASE_ANON_KEY);

export function getSupabase() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = getSupabase();

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
