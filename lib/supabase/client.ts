import { createBrowserClient } from "@supabase/ssr";

const FALLBACK_SUPABASE_URL = "https://knzxcacncetecdokothd.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuenhjYWNuY2V0ZWNkb2tvdGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDM5MTQsImV4cCI6MjEwNjgxOTkxNH0.VqA0RzBXe_0KpyPUlgnRaDXW3PXXGGN7mCkS1k3zDEU";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
  return createBrowserClient(url, key);
}
