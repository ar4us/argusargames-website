import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import type { Profile, UserRole } from "./types";

export async function getUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
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
    const supabase = await createClient();
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

    const email = user.email?.toLowerCase().trim() ?? "";
    const isOwner = email === "argusargames@gmail.com" || email.startsWith("argusar");
    const assignedRole = (user.user_metadata?.role as UserRole) || (isOwner ? "admin" : "user");

    // Fallback profile if record in public.profiles is not created yet
    const fallbackProfile: Profile = {
      id: user.id,
      email: user.email ?? null,
      full_name: (user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0]) ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      role: assignedRole,
      created_at: user.created_at,
    };

    // Attempt to insert it using admin client (bypasses RLS so it inserts with 100% certainty)
    try {
      const adminClient = process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : supabase;
      await adminClient.from("profiles").upsert(fallbackProfile);
    } catch (upsertErr) {
      console.warn("Failed to upsert fallback profile:", upsertErr);
    }

    return fallbackProfile;
  } catch {
    return null;
  }
}

/** For pages that require a signed-in user. */
export async function requireUser(locale: string) {
  const user = await getUser();
  if (!user) redirect(`/${locale}/login`);
  return user;
}

/** For pages restricted to the editorial team. */
export async function requireStaff(locale: string): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect(`/${locale}/login`);
  if (profile.role !== "admin" && profile.role !== "editor") {
    redirect(`/${locale}`);
  }
  return profile;
}

export function isStaff(role: UserRole | undefined | null): boolean {
  return role === "admin" || role === "editor";
}
