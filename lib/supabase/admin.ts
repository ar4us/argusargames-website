import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://knzxcacncetecdokothd.supabase.co";
const FALLBACK_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuenhjYWNuY2V0ZWNkb2tvdGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDM5MTQsImV4cCI6MjEwNjgxOTkxNH0.VqA0RzBXe_0KpyPUlgnRaDXW3PXXGGN7mCkS1k3zDEU";

// Service-role client for privileged admin operations (bypasses RLS).
// Server-only. Never import this into client components.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SERVICE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service role configuration");
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
