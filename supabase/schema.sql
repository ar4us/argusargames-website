-- ============================================================================
-- ArgusArGames — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- Safe to run once on a fresh project.
-- ============================================================================

-- ---------- Enums -----------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('user', 'editor', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_status as enum
    ('pending', 'approved', 'in_progress', 'completed', 'rejected');
exception when duplicate_object then null; end $$;

-- ---------- Tables ----------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  role        public.user_role not null default 'user',
  created_at  timestamptz not null default now()
);

create table if not exists public.games (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title_ar       text not null,
  title_en       text not null,
  description_ar text,
  description_en text,
  cover_url      text,
  steam_url      text,
  published      boolean not null default true,
  download_count integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.versions (
  id             uuid primary key default gen_random_uuid(),
  game_id        uuid not null references public.games (id) on delete cascade,
  version        text not null,
  release_date   date,
  notes_ar       text,
  notes_en       text,
  download_url   text not null,
  download_count integer not null default 0,
  created_at     timestamptz not null default now()
);
create index if not exists versions_game_idx on public.versions (game_id);

create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  game_name   text not null,
  game_url    text,
  notes       text,
  status      public.request_status not null default 'pending',
  vote_count  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists requests_votes_idx on public.requests (vote_count desc);

create table if not exists public.request_votes (
  request_id uuid not null references public.requests (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (request_id, user_id)
);

create table if not exists public.site_settings (
  id               integer primary key default 1 check (id = 1),
  site_name_ar     text not null default 'ArgusArGames',
  site_name_en     text not null default 'ArgusArGames',
  social_facebook  text,
  social_twitter   text,
  social_reddit    text,
  social_discord   text,
  social_telegram  text,
  updated_at       timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict do nothing;

-- ---------- Helper: is the current user staff? ------------------------------
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- ---------- New auth user -> profile ---------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Keep timestamps fresh ------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists games_touch on public.games;
create trigger games_touch before update on public.games
  for each row execute function public.touch_updated_at();

-- ---------- Keep download counts in sync -----------------------------------
create or replace function public.sync_game_downloads()
returns trigger language plpgsql security definer set search_path = public as $$
declare gid uuid;
begin
  gid := coalesce(new.game_id, old.game_id);
  update public.games g set download_count =
    (select coalesce(sum(v.download_count), 0) from public.versions v where v.game_id = gid)
  where g.id = gid;
  return null;
end; $$;

drop trigger if exists versions_sync_downloads on public.versions;
create trigger versions_sync_downloads
  after insert or update of download_count or delete on public.versions
  for each row execute function public.sync_game_downloads();

create or replace function public.increment_version_download(p_version_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.versions
    set download_count = download_count + 1
  where id = p_version_id;
end; $$;
grant execute on function public.increment_version_download(uuid) to anon, authenticated;

-- ---------- Votes -----------------------------------------------------------
create or replace function public.sync_request_vote_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare rid uuid;
begin
  rid := coalesce(new.request_id, old.request_id);
  update public.requests r set vote_count =
    (select count(*) from public.request_votes v where v.request_id = rid)
  where r.id = rid;
  return null;
end; $$;

drop trigger if exists votes_sync_count on public.request_votes;
create trigger votes_sync_count
  after insert or delete on public.request_votes
  for each row execute function public.sync_request_vote_count();

create or replace function public.toggle_request_vote(p_request_id uuid)
returns table (voted boolean, vote_count integer)
language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_exists boolean;
begin
  if v_uid is null then raise exception 'authentication required'; end if;
  select exists(
    select 1 from public.request_votes
    where request_id = p_request_id and user_id = v_uid
  ) into v_exists;

  if v_exists then
    delete from public.request_votes
      where request_id = p_request_id and user_id = v_uid;
  else
    insert into public.request_votes (request_id, user_id)
      values (p_request_id, v_uid) on conflict do nothing;
  end if;

  return query
    select not v_exists,
      (select r.vote_count from public.requests r where r.id = p_request_id);
end; $$;
grant execute on function public.toggle_request_vote(uuid) to authenticated;

-- ---------- View: games + latest version -----------------------------------
create or replace view public.games_with_latest as
select
  g.*,
  (select v.version from public.versions v
     where v.game_id = g.id
     order by v.release_date desc nulls last, v.created_at desc limit 1) as latest_version,
  (select count(*) from public.versions v where v.game_id = g.id) as version_count
from public.games g;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles      enable row level security;
alter table public.games         enable row level security;
alter table public.versions      enable row level security;
alter table public.requests      enable row level security;
alter table public.request_votes enable row level security;
alter table public.site_settings enable row level security;

-- profiles -------------------------------------------------------------------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update
  using (auth.uid() = id or public.is_staff());

-- games ----------------------------------------------------------------------
drop policy if exists games_select on public.games;
create policy games_select on public.games for select
  using (published = true or public.is_staff());

drop policy if exists games_insert on public.games;
create policy games_insert on public.games for insert with check (public.is_staff());

drop policy if exists games_update on public.games;
create policy games_update on public.games for update using (public.is_staff());

drop policy if exists games_delete on public.games;
create policy games_delete on public.games for delete using (public.is_staff());

-- versions -------------------------------------------------------------------
drop policy if exists versions_select on public.versions;
create policy versions_select on public.versions for select using (true);

drop policy if exists versions_write on public.versions;
create policy versions_write on public.versions for all
  using (public.is_staff()) with check (public.is_staff());

-- requests -------------------------------------------------------------------
drop policy if exists requests_select on public.requests;
create policy requests_select on public.requests for select using (true);

drop policy if exists requests_insert on public.requests;
create policy requests_insert on public.requests for insert
  with check (auth.uid() = user_id);

drop policy if exists requests_update on public.requests;
create policy requests_update on public.requests for update using (public.is_staff());

drop policy if exists requests_delete on public.requests;
create policy requests_delete on public.requests for delete
  using (public.is_staff() or auth.uid() = user_id);

-- request votes (votes are written through the RPC, but keep direct safety) --
drop policy if exists votes_select on public.request_votes;
create policy votes_select on public.request_votes for select using (true);

drop policy if exists votes_insert on public.request_votes;
create policy votes_insert on public.request_votes for insert
  with check (auth.uid() = user_id);

drop policy if exists votes_delete on public.request_votes;
create policy votes_delete on public.request_votes for delete
  using (auth.uid() = user_id);

-- settings -------------------------------------------------------------------
drop policy if exists settings_select on public.site_settings;
create policy settings_select on public.site_settings for select using (true);

drop policy if exists settings_update on public.site_settings;
create policy settings_update on public.site_settings for update using (public.is_staff());

-- ============================================================================
-- Storage: public "covers" bucket
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

drop policy if exists covers_read on storage.objects;
create policy covers_read on storage.objects for select
  using (bucket_id = 'covers');

drop policy if exists covers_write on storage.objects;
create policy covers_write on storage.objects for insert
  with check (bucket_id = 'covers' and public.is_staff());

drop policy if exists covers_update on storage.objects;
create policy covers_update on storage.objects for update
  using (bucket_id = 'covers' and public.is_staff());

drop policy if exists covers_delete on storage.objects;
create policy covers_delete on storage.objects for delete
  using (bucket_id = 'covers' and public.is_staff());

-- ============================================================================
-- Promote your first admin (run after signing up once), e.g.:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ============================================================================
