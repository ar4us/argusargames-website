import { supabase, isSupabaseConfigured } from "./supabase";
import type { Profile, UserRole } from "./types";

export async function getUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      return data as Profile;
    }

    const assignedRole: UserRole = (user.user_metadata?.role as UserRole) || "user";
    const fallbackProfile: Profile = {
      id: user.id,
      email: user.email ?? null,
      full_name:
        (user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0]) ??
        null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      role: assignedRole,
      created_at: user.created_at,
    };

    return fallbackProfile;
  } catch {
    return null;
  }
}

export function isStaff(role: UserRole | undefined | null): boolean {
  return role === "admin" || role === "editor";
}
