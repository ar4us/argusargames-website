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

// ArgusOs Full Wordmark matching mockup
export function Wordmark({
  name = "ArgusOs",
  className,
}: {
  name?: string;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3 group select-none", className)}>
      <LogoMark className="h-11 w-11" />
      <span className="flex flex-col">
        <span className="flex items-center gap-1 leading-none">
          <span className="text-xl font-black tracking-wider text-white font-mono group-hover:text-[#00ff66] transition-colors">
            ARGUS<span className="text-[#00ff66]">OS</span>
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 font-mono">
            HUB
          </span>
        </span>
        <span className="text-xs font-black tracking-widest text-[#00ff66] mt-1 flex items-center gap-1.5">
          <span className="h-0.5 w-3 bg-[#00ff66]/40 rounded-full" />
          <span>تعريب</span>
          <span className="h-0.5 w-3 bg-[#00ff66]/40 rounded-full" />
        </span>
      </span>
    </span>
  );
}
