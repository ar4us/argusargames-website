"use client";

import { Bell, ExternalLink } from "lucide-react";
import { FaDiscord, FaXTwitter, FaTelegram, FaRedditAlien } from "react-icons/fa6";

export function UpdatesTracker() {
  const channels = [
    {
      name: "Discord",
      label: "سيرفر الدعم الفني والمجتمع",
      description: "انضم لمجتمع اللاعبين واطلب المساعدة التقنية فوراً",
      href: "https://discord.gg/",
      icon: FaDiscord,
      color: "hover:border-[#5865F2]/50 hover:bg-[#5865F2]/5 text-[#5865F2]",
    },
    {
      name: "منصة X (تويتر)",
      label: "الأخبار والتحديثات اليومية",
      description: "تابع الإعلانات ومواعيد إطلاق التعريبات الجديدة",
      href: "https://x.com/",
      icon: FaXTwitter,
      color: "hover:border-foreground/40 hover:bg-foreground/5 text-foreground",
    },
    {
      name: "قناة Telegram",
      label: "إشعارات الباتشات والروابط",
      description: "تنبيهات مباشرة فور توفر أي باتش أو تحديث جديد",
      href: "https://t.me/",
      icon: FaTelegram,
      color: "hover:border-[#229ED9]/50 hover:bg-[#229ED9]/5 text-[#229ED9]",
    },
    {
      name: "مجتمع Reddit",
      label: "نقاشات ومستجدات التعريب",
      description: "شارك في النقاشات وطرح الأسئلة ومتابعة كل جديد",
      href: "https://reddit.com/",
      icon: FaRedditAlien,
      color: "hover:border-[#FF4500]/50 hover:bg-[#FF4500]/5 text-[#FF4500]",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          تابع التحديثات والأحداث
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <a
              key={ch.name}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 shadow-xs ${ch.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="mt-3 text-sm font-bold text-foreground">
                  {ch.name}
                </h3>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                  {ch.label}
                </p>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  {ch.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-semibold text-muted group-hover:text-foreground transition-colors flex items-center justify-between">
                <span>انضم الآن</span>
                <span>←</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
