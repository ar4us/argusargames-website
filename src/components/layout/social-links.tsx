import {
  FaDiscord,
  FaFacebookF,
  FaRedditAlien,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SocialLinks({
  settings,
  className,
  size = "md",
}: {
  settings: SiteSettings;
  className?: string;
  size?: "sm" | "md";
}) {
  const links = [
    { href: settings.social_facebook, label: "Facebook", Icon: FaFacebookF },
    { href: settings.social_twitter, label: "X", Icon: FaXTwitter },
    { href: settings.social_reddit, label: "Reddit", Icon: FaRedditAlien },
    { href: settings.social_discord, label: "Discord", Icon: FaDiscord },
    { href: settings.social_telegram, label: "Telegram", Icon: FaTelegram },
  ].filter((l) => Boolean(l.href));

  if (links.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              "flex items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent",
              size === "sm" ? "h-8 w-8" : "h-10 w-10",
            )}
          >
            <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </a>
        </li>
      ))}
    </ul>
  );
}
