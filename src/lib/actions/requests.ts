import type { FormState, VoteResult } from "@/lib/action-types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function createRequestAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const requestType = String(formData.get("request_type") ?? "new_translation").trim();
  const gameName = String(formData.get("game_name") ?? "").trim();
  const gameUrl = String(formData.get("game_url") ?? "").trim();
  const bugType = String(formData.get("bug_type") ?? "").trim();
  const updateVersion = String(formData.get("update_version") ?? "").trim();
  const rawNotes = String(formData.get("notes") ?? "").trim();

  if (!gameName) return { ok: false, error: "required" };
  if (!isSupabaseConfigured()) return { ok: false, error: "unknown" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  let typeLabel = "طلب تعريب جديد";
  let compiledNotes = rawNotes;
  if (requestType === "update_request") {
    typeLabel = "طلب تحديث تعريب";
    compiledNotes = [
      updateVersion ? `[إصدار/تفاصيل التحديث: ${updateVersion}]` : "",
      rawNotes,
    ].filter(Boolean).join("\n\n");
  } else if (requestType === "bug_report") {
    typeLabel = "إبلاغ عن خطأ";
    compiledNotes = [
      bugType ? `[نوع المشكلة: ${bugType}]` : "",
      rawNotes,
    ].filter(Boolean).join("\n\n");
  }

  const { error } = await supabase.from("requests").insert({
    user_id: user.id,
    game_name: gameName,
    game_url: gameUrl || null,
    notes: compiledNotes || null,
    request_type: requestType,
  });

  if (error) {
    const fallbackNotes = `[${typeLabel}]\n${compiledNotes || ""}`.trim();
    const fallbackRes = await supabase.from("requests").insert({
      user_id: user.id,
      game_name: gameName,
      game_url: gameUrl || null,
      notes: fallbackNotes || null,
    });
    if (fallbackRes.error) return { ok: false, error: "unknown" };
  }

  return { ok: true };
}

export async function voteAction(
  requestId: string,
  _locale = "ar",
): Promise<VoteResult> {
  if (!isSupabaseConfigured()) return { ok: false, error: "unknown" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const { data, error } = await supabase.rpc("toggle_request_vote", {
    p_request_id: requestId,
  });
  if (error) return { ok: false, error: "unknown" };

  const row = Array.isArray(data) ? data[0] : data;
  return {
    ok: true,
    voted: (row as { voted: boolean })?.voted ?? false,
    vote_count: (row as { vote_count: number })?.vote_count ?? 0,
  };
}
