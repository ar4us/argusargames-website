"use client";

import { ThumbsUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { voteAction } from "@/lib/actions/requests";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function VoteButton({
  requestId,
  initialCount,
  initialVoted,
  className,
}: {
  requestId: string;
  initialCount: number;
  initialVoted: boolean;
  className?: string;
}) {
  const t = useTranslations("request");
  const locale = useLocale();
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [pending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      const res = await voteAction(requestId, locale);
      if (res.error === "auth") {
        router.push("/login");
        return;
      }
      if (res.ok) {
        setCount(res.vote_count ?? count);
        setVoted(res.voted ?? voted);
      }
    });

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={voted}
      aria-label={t("vote")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-60",
        voted
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
        className,
      )}
    >
      <ThumbsUp
        className="h-4 w-4"
        fill={voted ? "currentColor" : "none"}
        aria-hidden
      />
      <span className="tabular">{count}</span>
    </button>
  );
}