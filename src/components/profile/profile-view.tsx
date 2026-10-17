"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { LocalizationRequest, Profile } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";

export function ProfileView({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [requests, setRequests] = useState<LocalizationRequest[]>([]);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        window.location.href = `/${locale}/login`;
        return;
      }

      setUser(authUser);

      const [profileRes, requestsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle(),
        supabase
          .from("requests")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data as Profile);
      }
      if (requestsRes.data) {
        setRequests(requestsRes.data as LocalizationRequest[]);
      }
      setLoading(false);
    }

    loadData();
  }, [locale]);

  if (loading) {
    return (
      <div className="py-20 text-center text-muted">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        <p className="mt-3 text-sm">جارٍ تحميل بيانات الحساب…</p>
      </div>
    );
  }

  const name =
    profile?.full_name || user?.email?.split("@")[0] || "مستخدم";
  const roleLabel =
    profile?.role === "admin"
      ? "مدير"
      : profile?.role === "editor"
        ? "محرر"
        : "مستخدم";

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Account card */}
      <section className="lg:col-span-1">
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
          <div className="flex items-center gap-3 border-b border-border bg-surface-2 px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{name}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <dl className="divide-y divide-border">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5">
              <dt className="text-sm text-muted">الرتبة</dt>
              <dd>
                <Badge tone="accent">{roleLabel}</Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-3.5">
              <dt className="text-sm text-muted">تاريخ الانضمام</dt>
              <dd>
                <span className="tabular text-sm text-foreground">
                  {formatDate(profile?.created_at ?? user?.created_at, locale)}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* My requests */}
      <section className="lg:col-span-2">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
          طلباتي وبلاغاتي
        </h2>
        {requests.length > 0 ? (
          <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            {requests.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {req.game_name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    <span className="tabular">
                      {formatNumber(req.vote_count, locale)}
                    </span>{" "}
                    صوت • {req.status}
                  </p>
                </div>
                <Badge tone="neutral">{req.status}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[var(--radius-card)] border border-dashed border-border-strong px-4 py-10 text-center text-sm text-muted">
            لم تقم بإرسال أي طلبات بعد.
          </p>
        )}
      </section>
    </div>
  );
}
