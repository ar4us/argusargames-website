import { supabase, isSupabaseConfigured } from "../supabase";

export function createClient() {
  return supabase;
}

export { isSupabaseConfigured };
