import { cn } from "@/lib/utils";

// Argus mark: a watchful aperture-eye with modern gaming gradient
export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-accent via-violet-600 to-amber-500 p-0.5 shadow-md shadow-accent/20 transition-transform duration-300 hover:scale-105", className)}>
      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-surface">
        <svg
          viewBox="0 0 32 32"
          role="img"
          aria-hidden
          className="h-5 w-5"
        >
          <path
            d="M6 16c3.4-5.2 7-7.8 10-7.8S22.6 10.8 26 16c-3.4 5.2-7 7.8-10 7.8S9.4 21.2 6 16Z"
            className="fill-none stroke-accent"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="3.6" className="fill-accent" />
          <circle cx="16" cy="16" r="1.4" className="fill-amber-400" />
        </svg>
      </div>
    </div>
  );
}

export function Wordmark({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      <span className="flex flex-col">
        <span className="text-lg font-black tracking-tight text-foreground leading-none">
          {name}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mt-0.5">
          Localizations
        </span>
      </span>
    </span>
  );
}
