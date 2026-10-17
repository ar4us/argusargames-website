import { Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Minimal, elegant brand logo mark
export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-transform hover:scale-105",
        className
      )}
    >
      <Gamepad2 className="h-5 w-5" />
    </div>
  );
}

// Clean Wordmark: Small icon + Modern typography
export function Wordmark({
  name = "Argus Games",
  className,
}: {
  name?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 font-bold tracking-tight select-none", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
        <Gamepad2 className="h-4 w-4" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-base font-extrabold text-foreground">
          {name || "Argus Games"}
        </span>
        <span className="text-[10px] font-medium text-muted">
          تعريب الألعاب
        </span>
      </div>
    </div>
  );
}
