import Image from "next/image";
import { cn } from "@/lib/utils";

// ArgusOs Cyber Emblem
export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#00ff66]/40 bg-[#07120a] p-0.5 shadow-md shadow-[#00ff66]/20 transition-all duration-300 hover:border-[#00ff66] hover:shadow-[#00ff66]/40 hover:scale-105", className)}>
      <Image
        src="/images/branding/argusos-emblem.png"
        alt="ArgusOs"
        width={40}
        height={40}
        className="h-full w-full object-cover rounded-[10px]"
        priority
      />
    </div>
  );
}

// ArgusOs Exact Navbar Logo matching mockup
export function Wordmark({
  className,
}: {
  name?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-center select-none py-1", className)}>
      <Image
        src="/images/branding/navbar-logo.png"
        alt="ARGUSOS تعريب"
        width={220}
        height={56}
        className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,255,102,0.35)] transition-transform duration-300 hover:scale-[1.03]"
        priority
      />
    </div>
  );
}
