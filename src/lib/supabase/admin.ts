import { supabase } from "../supabase";

export function createAdminClient() {
  return supabase;
}
