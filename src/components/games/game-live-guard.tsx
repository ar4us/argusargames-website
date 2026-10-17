"use client";

import { useEffect, useState } from "react";
import { EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface GameLiveGuardProps {
  gameId: string;
  slug: string;
  initialPublished: boolean;
  locale: string;
  children: React.ReactNode;
}

export function GameLiveGuard({
  gameId,
  slug,
  initialPublished,
  locale,
  children,
}: GameLiveGuardProps) {
  const [published, setPublished] = useState<boolean>(initialPublished);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is admin from cached user
    try {
      const cached = localStorage.getItem("argus_cached_user");
      if (cached) {
        const u = JSON.parse(cached);
        if (u.role === "admin" || u.role === "editor") {
          setIsAdmin(true);
        }
      }
    } catch {}

    // Live query published state from Supabase
    try {
      const supabase = createClient();
      supabase
        .from("games")
        .select("published")
        .eq("id", gameId)
        .maybeSingle()
        .then(({ data }) => {
          if (data && typeof data.published === "boolean") {
            setPublished(data.published);
          }
        });
    } catch {}
  }, [gameId]);

  // If published: show normal game page
  if (published) {
    return <>{children}</>;
  }

  // If unpublished AND user is admin: show page with admin warning banner!
  if (isAdmin) {
    return (
      <div>
        <div className="bg-amber-500/10 border-b border-amber-500/30 py-3 px-4 text-xs font-semibold text-amber-500">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 shrink-0" />
              <span>
                {locale === "ar"
                  ? "وضع المعاينة الإدارية: هذا التعريب مسودة غير منشورة وهو مخفي تماماً عن الزوار العاديين."
                  : "Admin Preview Mode: This game is currently unpublished and hidden from regular visitors."}
              </span>
            </div>
            <a
              href={`/${locale}/admin/games/${gameId}`}
              className="underline hover:text-amber-400 shrink-0 font-bold"
            >
              {locale === "ar" ? "تعديل في لوحة التحكم" : "Edit in Admin"}
            </a>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // If unpublished and visitor is NOT admin: show friendly unpublished screen
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <EyeOff className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {locale === "ar" ? "التعريب غير متاح حاليًا" : "Localization Unavailable"}
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          {locale === "ar"
            ? "تم إخفاء هذا التعريب مؤقتًا من قبل إدارة الموقع لإجراء تحديثات وتحسينات. سيعود متاحًا للتحميل قريبًا."
            : "This localization has been temporarily unpublished for updates. It will be available again soon."}
        </p>
        <div className="mt-8">
          <a
            href={`/${locale}/games`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            <span>{locale === "ar" ? "تصفح كافة التعريبات المتوفرة" : "Browse Available Games"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
