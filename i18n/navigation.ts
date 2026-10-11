import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers. Use these everywhere instead of next/link.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
