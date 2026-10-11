"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // 1. If OAuth returned code directly to an app route (e.g. /ar?code=...), exchange it here on client
    if (typeof window !== "undefined" && window.location.search.includes("code=")) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (!error && data?.session) {
            // Clean the ?code= from the address bar
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            window.location.reload();
          }
        });
      }
    }

    // 2. Listen for auth changes across tabs
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
