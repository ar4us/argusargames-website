import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import { revalidatePath } from "next/cache";

// Counts a download, then redirects the visitor to the actual file.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ versionId: string }> },
) {
  const { versionId } = await params;
  const home = new URL("/", request.url);

  if (!isSupabaseConfigured()) return NextResponse.redirect(home);

  try {
    const userClient = await createClient();
    const {
      data: { user },
    } = await userClient.auth.getUser();

    // If visitor is not authenticated, redirect them to login page with return url
    if (!user) {
      const referer = request.headers.get("referer");
      let returnPath = "/";
      if (referer) {
        try {
          const refUrl = new URL(referer);
          returnPath = `${refUrl.pathname}${refUrl.search}`;
        } catch {}
      }
      const locale = returnPath.startsWith("/en") ? "en" : "ar";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirectTo", returnPath);
      return NextResponse.redirect(loginUrl);
    }

    // Always use service role client to ensure database updates bypass any RLS limitations
    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createAdminClient()
      : userClient;

    const { data: versionData, error: verErr } = await supabase
      .from("versions")
      .select("id, game_id, download_url, download_count")
      .eq("id", versionId)
      .maybeSingle();

    if (verErr || !versionData?.download_url) {
      console.warn("Version not found or error:", verErr);
      return NextResponse.redirect(home);
    }

    const targetUrl = versionData.download_url;
    const currentCount = versionData.download_count ?? 0;
    const newCount = currentCount + 1;

    // 1. Direct update on versions table
    await supabase
      .from("versions")
      .update({ download_count: newCount })
      .eq("id", versionId);

    // 2. Direct update on games table if game_id is present
    if (versionData.game_id) {
      const { data: gameData } = await supabase
        .from("games")
        .select("slug, download_count")
        .eq("id", versionData.game_id)
        .maybeSingle();

      if (gameData) {
        const gameCount = (gameData.download_count ?? 0) + 1;
        await supabase
          .from("games")
          .update({ download_count: gameCount })
          .eq("id", versionData.game_id);

        if (gameData.slug) {
          revalidatePath(`/ar/games/${gameData.slug}`);
          revalidatePath(`/en/games/${gameData.slug}`);
        }
      }
    }

    // 3. Trigger RPC as well for redundancy
    try {
      await supabase.rpc("increment_version_download", { p_version_id: versionId });
    } catch {}

    // 4. Invalidate home & games listing pages cache so numbers update immediately
    revalidatePath("/ar");
    revalidatePath("/en");
    revalidatePath("/ar/games");
    revalidatePath("/en/games");

    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.error("Download route exception:", err);
    return NextResponse.redirect(home);
  }
}
