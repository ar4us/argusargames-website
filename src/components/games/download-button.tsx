"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { ButtonVariant } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { formatNumber, cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export function DownloadButton({
  versionId,
  count,
  locale,
  label,
  variant = "primary",
  size = "md",
  className,
  showCount = true,
  downloadUrl,
}: {
  versionId: string;
  count: number;
  locale: string;
  label: string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  showCount?: boolean;
  downloadUrl?: string;
}) {
  const [downloading, setDownloading] = useState(false);
  const [currentCount, setCurrentCount] = useState(count);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);

    try {
      let targetUrl = downloadUrl;

      // If no direct downloadUrl passed, fetch from Supabase
      if (!targetUrl) {
        const { data: ver } = await supabase
          .from("versions")
          .select("id, game_id, download_url, download_count")
          .eq("id", versionId)
          .maybeSingle();
        targetUrl = ver?.download_url;
      }

      if (!targetUrl) {
        alert("عذراً، رابط التحميل غير متاح حالياً.");
        setDownloading(false);
        return;
      }

      // Increment count client-side directly
      try {
        await supabase.rpc("increment_version_download", {
          p_version_id: versionId,
        });
      } catch {}

      setCurrentCount((prev) => prev + 1);

      // Trigger direct download / open URL in new tab or direct
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span>{label}</span>
      {showCount ? (
        <span className="tabular opacity-80">
          ({formatNumber(currentCount, locale)})
        </span>
      ) : null}
    </button>
  );
}
