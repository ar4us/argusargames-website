import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://knzxcacncetecdokothd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuenhjYWNuY2V0ZWNkb2tvdGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNDM5MTQsImV4cCI6MjEwNjgxOTkxNH0.VqA0RzBXe_0KpyPUlgnRaDXW3PXXGGN7mCkS1k3zDEU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Localization {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  cover_url: string;
  download_url: string;
  file_size: string;
  version: string;
  platforms: string[];
  status: 'complete' | 'in_progress' | 'update';
  translator: string;
  downloads_count: number;
  created_at: string;
}

export interface GameRequest {
  id: string;
  game_title: string;
  platform: string;
  notes: string;
  user_email: string | null;
  user_id: string | null;
  upvotes: number;
  status: 'pending' | 'planned' | 'in_progress' | 'rejected' | 'completed';
  created_at: string;
}
