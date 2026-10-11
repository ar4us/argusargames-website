"use client";

import { Terminal } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function TopCyberBanner() {
  return (
    <div className="hidden lg:block border-b border-[#132d19] bg-[#020503]/90 text-[11px] font-mono text-[#739980] py-1.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Terminal status line */}
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]" />
          </span>
          <span className="text-[#00ff66] font-semibold flex items-center gap-1.5">
            <Terminal className="h-3 w-3" />
            &gt; SYSTEM: ONLINE
          </span>
          <span className="text-[#1e4a27]">|</span>
          <span className="text-slate-400">ANALYZING PATCHES...</span>
          <span className="text-[#00ff66]/80">&gt; TRANSLATING... [100% DONE]</span>
        </div>

        {/* Quick HUD Chips */}
        <div className="flex items-center gap-4 text-[10px] tracking-wider text-slate-400">
          <Link href="/games" className="hover:text-[#00ff66] transition-colors">
            <span className="text-[#00ff66]">[+]</span> GAMES
          </Link>
          <Link href="/games" className="hover:text-[#00ff66] transition-colors">
            <span className="text-[#00ff66]">[+]</span> LOCALIZATION
          </Link>
          <Link href="/request" className="hover:text-[#00ff66] transition-colors">
            <span className="text-[#00ff66]">[+]</span> REQUEST
          </Link>
        </div>

        {/* Right Tagline */}
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-slate-400 font-bold uppercase">
          <span>PLAY</span>
          <span className="text-[#00ff66]">&bull;</span>
          <span>UNDERSTAND</span>
          <span className="text-[#00ff66]">&bull;</span>
          <span>EXPLORE</span>
          <span className="text-[#00ff66]">&bull;</span>
          <span className="text-[#00ff66]">IN ARABIC</span>
        </div>
      </div>
    </div>
  );
}
