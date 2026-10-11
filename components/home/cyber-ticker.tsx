"use client";

import { Flame, Radio, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

const TICKER_ITEMS = [
  { text: "تعريب Silent Hill: Townfall متوفر الآن للتحميل حصرياً", link: "/games" },
  { text: "أكثر من 15,000 ملف وسطر نصي تم تعريبه وتدقيقه احترافياً", link: "/about" },
  { text: "باتشات PC و PlayStation متوافقة مع أحدث التحديثات الرسمية", link: "/games" },
  { text: "انضم لمجتمع اللاعبين والمترجمين في سيرفر الديسكورد", link: "https://discord.gg" },
  { text: "شارك في التصويت واطلب تعريب لعبتك المفضلة الآن", link: "/request" },
];

export function CyberTicker() {
  return (
    <div className="relative overflow-hidden border-b border-[#142e1a] bg-[#030905] py-2 text-xs font-mono text-[#8cb097]">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Status Badge */}
        <div className="shrink-0 flex items-center gap-2 rounded-md bg-[#00ff66]/10 border border-[#00ff66]/30 px-2.5 py-1 text-[#00ff66] font-bold text-[11px]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]" />
          </span>
          <Radio className="h-3 w-3" />
          <span>تحديثات حية</span>
        </div>

        {/* Ticker marquee */}
        <div className="flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="inline-flex gap-8 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, i) => (
              <Link
                key={i}
                href={item.link}
                className="inline-flex items-center gap-2 hover:text-[#00ff66] transition-colors"
              >
                <Sparkles className="h-3 w-3 text-[#00ff66]" />
                <span>{item.text}</span>
                <span className="text-[#1b3d22] font-normal mx-2">/</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Discord Pill */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 text-[11px] text-[#739980] border-s border-[#142e1a] ps-3">
          <span className="h-2 w-2 rounded-full bg-[#00ff66]" />
          <span>المجتمع نشط 24/7</span>
        </div>
      </div>
    </div>
  );
}
