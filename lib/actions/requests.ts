"use server";

import { revalidatePath } from "next/cache";
import type { FormState, VoteResult } from "@/lib/action-types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function createRequestAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const locale = String(formData.get("locale") ?? "ar");
  const gameName = String(formData.get("game_name") ?? "").trim();
  const gameUrl = String(formData.get("game_url") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!gameName) return { ok: false, error: "required" };
  if (!isSupabaseConfigured()) return { ok: false, error: "unknown" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  // Block accidental duplicate pending requests from the same user.
  const { data: existing } = await supabase
    .from("requests")
    .select("id")
    .eq("user_id", user.id)
    .ilike("game_name", gameName)
    .in("status", ["pending", "approved", "in_progress"])
    .maybeSingle();
  if (existing) return { ok: false, error: "duplicate" };

  const { error } = await supabase.from("requests").insert({
    user_id: user.id,
    game_name: gameName,
    game_url: gameUrl || null,
    notes: notes || null,
  });
  if (error) return { ok: false, error: "unknown" };

  revalidatePath(`/${locale}/request`);
  return { ok: true };
}

export async function voteAction(
  requestId: string,
  locale = "ar",
): Promise<VoteResult> {
  if (!isSupabaseConfigured()) return { ok: false, error: "unknown" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const { data, error } = await supabase.rpc("toggle_request_vote", {
    p_request_id: requestId,
  });
  if (error) return { ok: false, error: "unknown" };

  const row = Array.isArray(data) ? data[0] : data;
  revalidatePath(`/${locale}/request`);
  return {
    ok: true,
    voted: (row as { voted: boolean })?.voted ?? false,
    vote_count: (row as { vote_count: number })?.vote_count ?? 0,
  };
}
