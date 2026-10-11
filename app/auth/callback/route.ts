import { NextResponse, type NextRequest } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

// OAuth + email-link callback. Exchanges the code for a session, then sends
// the user back to wherever they were headed (next is locale-prefixed).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") ? rawNext.replace(/\/{2,}/g, "/") : "/ar";

  if (code && isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.user) {
        // Ensure profile exists in public.profiles table
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: data.user.email ?? null,
            full_name: (data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0]) ?? null,
            avatar_url: data.user.user_metadata?.avatar_url ?? null,
            role: "admin",
          });
        } catch {
          // ignore
        }
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch {
      // fall through to base redirect
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}