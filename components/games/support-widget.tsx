"use client";

import { Coffee, Heart, ExternalLink } from "lucide-react";

interface SupportWidgetProps {
  coffeeUrl?: string;
}

export function SupportWidget({ coffeeUrl = "https://buymeacoffee.com/argusos" }: SupportWidgetProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-surface to-surface p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Coffee className="h-3.5 w-3.5" />
            <span>ادعم استمرار التعريبات</span>
          </div>

          <h3 className="text-xl font-bold text-foreground">
            هل أعجبك التعريب؟ ادعم المترجم بفنجان قهوة ☕
          </h3>

          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            جميع التعريبات تقدم مجاناً وبأعلى جودة للاعبين العرب. مساهمتك البسيطة تساهم في تغطية تكاليف الخوادم وشراء الألعاب وتوفير الوقت لتعريب ألعاب جديدة أكبر وأكثر!
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={coffeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 hover:scale-[1.02]"
          >
            <Coffee className="h-4 w-4" />
            <span>Buy Me a Coffee</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </section>
  );
}
