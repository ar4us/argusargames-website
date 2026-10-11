"use client";

import { useState } from "react";
import { Gamepad2, Monitor, Play, Smartphone } from "lucide-react";

const PLATFORMS = [
  { id: "all", label: "الكل", icon: Gamepad2 },
  { id: "pc", label: "PC / Steam", icon: Monitor },
  { id: "ps5", label: "PS5", icon: Play },
  { id: "ps4", label: "PS4", icon: Play },
  { id: "switch", label: "Switch", icon: Gamepad2 },
  { id: "android", label: "Android", icon: Smartphone },
];

interface PlatformChipsProps {
  activePlatform?: string;
  onSelect?: (platform: string) => void;
}

export function PlatformChips({ activePlatform = "all", onSelect }: PlatformChipsProps) {
  const [selected, setSelected] = useState(activePlatform);

  const handleClick = (id: string) => {
    setSelected(id);
    if (onSelect) onSelect(id);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PLATFORMS.map((p) => {
        const Icon = p.icon;
        const isActive = selected === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => handleClick(p.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
              isActive
                ? "bg-[#00ff66] text-[#020703] shadow-md shadow-[#00ff66]/25 font-black"
                : "bg-[#061209] text-[#789d84] border border-[#142e1a] hover:border-[#00ff66]/50 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
