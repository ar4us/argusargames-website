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
}: {
  versionId: string;
  count: number;
  locale: string;
  label: string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  showCount?: boolean;
}) {
  const [downloading, setDownloading] = useState(false);
  const [currentCount, setCurrentCount] = useState(count);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);

    try {
      // 1. Fetch download URL
      const { data: ver, error } = await supabase
        .from("versions")
        .select("id, game_id, download_url, download_count")
        .eq("id", versionId)
        .maybeSingle();

      if (error || !ver?.download_url) {
        alert("عذراً، رابط التحميل غير متاح حالياً.");
        setDownloading(false);
        return;
      }

      // 2. Increment count client-side directly
      try {
        await supabase.rpc("increment_version_download", {
          p_version_id: versionId,
        });
      } catch {}

      setCurrentCount((prev) => prev + 1);

      // 3. Trigger direct download / open URL
      window.location.href = ver.download_url;
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setTimeout(() => setDownloading(false), 2000);
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
