"use client";

import { useState } from "react";
import { Monitor, Gamepad2, Play, Smartphone } from "lucide-react";

const PLATFORMS = [
  { id: "all", label: "جميع المنصات", icon: Gamepad2 },
  { id: "pc", label: "كمبيوتر (PC / Steam)", icon: Monitor },
  { id: "ps5", label: "PlayStation 5", icon: Play },
  { id: "ps4", label: "PlayStation 4", icon: Play },
  { id: "switch", label: "Nintendo Switch", icon: Gamepad2 },
];

export function PlatformChips({ onSelect }: { onSelect?: (p: string) => void }) {
  const [active, setActive] = useState("all");

  const handleSelect = (id: string) => {
    setActive(id);
    if (onSelect) onSelect(id);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PLATFORMS.map((p) => {
        const Icon = p.icon;
        const isSelected = active === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelect(p.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              isSelected
                ? "bg-foreground text-background"
                : "border border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
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
