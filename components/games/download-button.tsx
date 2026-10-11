import { Download } from "lucide-react";
import type { ButtonVariant } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Links to the counting redirect route. Rendered as a real anchor so it works
// without JS and triggers a browser download/navigation.
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
  return (
    <a
      href={`/api/download/${versionId}`}
      className={cn(buttonVariants({ variant, size }), className)}
      rel="noopener"
    >
      <Download className="h-4 w-4" />
      <span>{label}</span>
      {showCount ? (
        <span className="tabular opacity-80">
          ({formatNumber(count, locale)})
        </span>
      ) : null}
    </a>
  );
}
