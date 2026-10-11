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
    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createAdminClient()
      : await createClient();

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
