import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "./supabase/server";
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
      .single();
    return (data as Profile) ?? null;
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
