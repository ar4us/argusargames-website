# ArgusArGames — Arabic Game Localization Hub

A bilingual (AR/EN) platform to browse, request, and download Arabic game localizations. Visitors search the catalogue and download the latest version of a localization; signed-in users can request and vote on games; the editorial team manages everything from an admin dashboard.

Stack: Next.js 16 (App Router, TypeScript, Turbopack) · Tailwind CSS v4 · next-intl · Supabase (Postgres + Auth + Storage + RLS).

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your `.env.local` from `.env.example` and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (only needed if you skip the RPC grant below)

   If Supabase is not configured the site still runs and shows a friendly setup notice instead of erroring.

3. Set up the Supabase database. In the Supabase SQL editor, run the whole file:

   ```bash
   supabase/schema.sql
   ```

   This creates the tables, RLS policies, views, storage bucket, and functions. Re-run it once per project.

4. Promote the first admin. Creates run as regular `user` — after creating your account, run this in the SQL editor (replace the email):

   ```sql
   update profiles set role = 'admin'
   where id = (select id from auth.users where email = 'you@example.com' limit 1);
   ```

5. Run it:

   ```bash
   npm run dev
   # or
   npm run build && npm run start
   ```

    - Arabic: `http://localhost:3000/ar`
    - English: `http://localhost:3000/en`

## OAuth (Google / Discord)

Authentication works with email/password out of the box. To enable Google and/or Discord, add the providers in Supabase dashboard → Authentication → Providers and set the site URL in Authentication → URL Configuration to your app origin (e.g. `http://localhost:3000`).

## Seed data

To fill the catalogue quickly you can insert a game and a version by hand in the dashboard after logging in as an admin (Games → Add game → then add a version with a download URL). No seed script is required.

## Project structure

```
app/[locale]/        Public pages: home, games, games/[slug], request, profile, auth pages, admin/*
app/api/download/[versionId]   Download counter + redirect
components/          ui primitives, layout chrome, games, request, auth, admin forms
i18n/                next-intl routing + request config
lib/                 supabase clients, queries, auth guards, server actions, types, utils, seo
messages/            ar.json / en.json (all copy — add keys to BOTH files)
supabase/schema.sql  The entire database schema
```

## Notes

- Forms are Server Actions; each form carries a hidden `locale` field so actions can revalidate the right language path.
- `games_with_latest` is a view exposing `latest_version` and `download_count` per game; the public catalogue reads from it.
- Downloads go through `/api/download/[versionId]`, which calls `increment_version_download` then redirects to the real file URL.
- Data pages are `force-dynamic` (no caching of database reads).