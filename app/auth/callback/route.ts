import { NextResponse, type NextRequest } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

// OAuth + email-link callback. Exchanges the code for a session, then sends
// the user back to wherever they were headed (next is locale-prefixed).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") ? rawNext.replace(/\/{2,}/g, "/") : "/";

  if (code && isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    } catch {
      // fall through to base redirect
    }
  }

  return NextResponse.redirect(`${origin}/`);
}