import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

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

    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createAdminClient()
      : userClient;

    const { data } = await supabase
      .from("versions")
      .select("download_url")
      .eq("id", versionId)
      .maybeSingle();

    const url = (data as { download_url?: string } | null)?.download_url;
    if (!url) return NextResponse.redirect(home);

    await supabase.rpc("increment_version_download", { p_version_id: versionId });

    return NextResponse.redirect(url);
  } catch {
    return NextResponse.redirect(home);
  }
}
