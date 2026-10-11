// Domain types shared across the app.

export type Locale = "ar" | "en";

export type UserRole = "user" | "editor" | "admin";

export type RequestStatus =
  | "pending"
  | "approved"
  | "in_progress"
  | "completed"
  | "rejected";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Game {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  cover_url: string | null;
  steam_url: string | null;
  published: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface GameVersion {
  id: string;
  game_id: string;
  version: string;
  release_date: string | null;
  notes_ar: string | null;
  notes_en: string | null;
  download_url: string;
  download_count: number;
  created_at: string;
}

export interface LocalizationRequest {
  id: string;
  user_id: string;
  game_name: string;
  game_url: string | null;
  notes: string | null;
  status: RequestStatus;
  vote_count: number;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_name_ar: string;
  site_name_en: string;
  social_facebook: string | null;
  social_twitter: string | null;
  social_reddit: string | null;
  social_discord: string | null;
  social_telegram: string | null;
  updated_at: string;
}

// Row shape of the `games_with_latest` view, used on list cards.
export interface GameWithLatest extends Game {
  latest_version: string | null;
  version_count: number | null;
}
