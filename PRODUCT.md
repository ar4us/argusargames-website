# PRODUCT.md

## What this is

**ArgusArGames** — a bilingual (Arabic / English) hub for Arabic video-game localizations
("تعريبات"). Visitors browse games and download Arabic localization patches. The team
manages games, versions, requests, and site settings from a protected admin dashboard.

## Audience & scene

Arabic-speaking PC/console gamers who want to play games in Arabic. They arrive from
Telegram/Discord/Reddit on a phone or a desk PC, usually to find a specific game and grab
the newest patch fast. Ambient light varies; the interface must read well in both bright
and dim rooms, and the site ships light + dark themes following the OS by default.

## Job to be done

1. Find a game fast (search by Arabic or English name) and download its latest localization.
2. Request a localization for a game that lacks one; upvote existing requests.
3. Staff publish games/versions, track downloads, and manage social links and requests.

## Brand

- Name: **ArgusArGames** (Arabic wordmark: عربوس / أرغوس أربجي). Default wordmark: `ArgusArGames`.
- Voice: confident, clear, community-minded. Arabic-first, English fully supported.
- Visual world (committed for v1, code-led): **clean modern light** — a well-set games
  catalogue that reads like a sharp bilingual journal, not the dark-neon gaming default.
  Restrained color: cool ink neutrals on white/paper, one vivid action accent, one data accent.
  System-following dark theme is a first-class equal, not an afterthought.

## Constraints

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.
- Supabase (PostgreSQL + Auth + Storage) — chosen because it gives managed Postgres,
  row-level security, email/OAuth auth, and file storage in one service with an official
  SSR client for Next.js, so the small team ships without owning infra. Vercel-compatible.
- Full i18n with `/ar` and `/en` routes, RTL/LTR, `hreflang`, per-locale metadata.
- All UI copy lives in `messages/ar.json` and `messages/en.json`.

## Success

A first-time visitor knows what the site is, finds a game, and hits download within seconds;
staff can publish a game and version without touching code. Every public page works in both
languages and both theme modes, responsively, with real empty/loading/error states.
