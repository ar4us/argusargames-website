"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function CommunityRequest() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-blue-600/5 via-surface to-surface p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>طلب واقتراح التعريب مجاناً</span>
          </div>

          <h3 className="text-xl font-bold text-foreground">
            هل لديك لعبة ترغب في رؤيتها باللغة العربية؟
          </h3>

          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            يمكنك إرسال طلب تعريب لأي لعبة وسيقوم المجتمع بالتصويت عليها لتحديد أولويات مشاريع التعريب القادمة بشكل مجاني وديمقراطي تماماً!
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/request"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition-all duration-200 hover:scale-[1.02]"
          >
            <span>اقترح لعبة للتصويت</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
