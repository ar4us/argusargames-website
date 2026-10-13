"use client";

import { Coffee, Heart, ExternalLink } from "lucide-react";

interface SupportWidgetProps {
  kofiUrl?: string;
}

export function SupportWidget({ kofiUrl = "https://ko-fi.com/argusos" }: SupportWidgetProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 via-surface to-surface p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 dark:text-red-400">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>ادعم استمرار التعريبات</span>
          </div>

          <h3 className="text-xl font-bold text-foreground">
            هل أعجبك التعريب؟ ادعم المترجم بفنجان قهوة ☕
          </h3>

          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            جميع التعريبات تقدم مجاناً وبأعلى جودة للاعبين العرب. مساهمتك البسيطة تساهم في تغطية تكاليف الخوادم وتوفير الوقت لتعريب ألعاب جديدة أكبر وأكثر!
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5E5B] to-[#e04542] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-red-500/20 hover:opacity-95 transition-all duration-200 hover:scale-[1.02]"
          >
            <Coffee className="h-4 w-4" />
            <span>ادعمنا على Ko-fi</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </section>
  );
}
