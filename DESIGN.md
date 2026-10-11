---
name: ArgusArGames
description: A bilingual Arabic game-localization catalogue — clean modern light, reads like a sharp games journal.
colors:
  paper-bg: "#fbfbfa"
  surface: "#ffffff"
  surface-raised: "#f4f4f2"
  ink: "#14151a"
  ink-muted: "#5b6070"
  line: "#e3e3df"
  line-strong: "#d2d2cc"
  violet: "#6d28d9"
  violet-deep: "#5b21b6"
  violet-on: "#ffffff"
  violet-wash: "#f2ecfe"
  amber-data: "#b45309"
  success: "#15803d"
  warning: "#b45309"
  danger: "#dc2626"
  info: "#1d4ed8"
typography:
  display:
    fontFamily: "Cairo, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Cairo, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Cairo, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Cairo, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Cairo, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.06em"
rounded:
  card: "14px"
  control: "10px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.violet-on}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.violet-deep}"
    textColor: "{colors.violet-on}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 16px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "40px"
    padding: "0 12px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 12px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 14px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "16px"
  badge:
    backgroundColor: "{colors.violet-wash}"
    textColor: "{colors.violet}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
---

# Design System: ArgusArGames

## Overview

**Creative North Star: "The Bilingual Games Journal"**

ArgusArGames is a games catalogue that presents Arabic localizations with the composure of a sharp, well-set magazine rather than the dark-neon gaming default. Visitors land looking for one game and a fresh download; the interface removes friction — a working search leads every public page, covers carry the personality, and numbers read as calm data. Light is the committed first environment (paper-white, cool ink, one vivid violet accent), with a system-following dark theme as a first-class equal, not a degraded afterthought.

The voice is confident but quiet: restraint in decoration, confidence in order. Interactive color is earned, never cosmetic; the violet signals the moment you can act, the amber signals "warmth / most downloaded / working," and everything else stays in a cool neutral scale. Both languages are equal citizens — Arabic-first, RTL and English LTR mirror correctly in component, grid, and microcopy.

The material is paper + ink: flat surfaces separated by hairline lines and one raised step, faint lift only under an interactive card you can now press. One authored entrance per viewport (a brief rise), collected in the shared animation token.

**Characters:** compact card grids (2–4 across by breakpoint), a ranked list for "most downloaded" for a different rhythm, tabular numerals on every count. Covers are 3:4 and treated as the artwork they are.

**Key Characteristics:**
- Cool ink neutrals on paper; violet action accent; amber data accent.
- Hairline line + tonal step separation; faint hover lift only.
- One authored entrance (rise) per viewport; reduced-motion fully honored.
- Tabular numerals on all counts and versions.
- Cairo (Arabic) + Inter (Latin) pair, tuned tracking, max text measure ~65–75ch.

## Colors

A restrained two-accent palette: violet is the singular action handler, amber is the data/warm accent, everything else is cool paper and ink.

### Primary
- **Route Violet** (#6d28d9; hover #5b21b6): the only action accent. Primary buttons, links and active nav, focus ring, "download" moments, selection, caret. In dark mode it opens to hairline violet #8b5cf6 / #a78bfa and its wash turns to deep muted violet (#241b3d) so it still reads without clamoring.
- **Violet On** (#ffffff: what sits on Route Violet; in dark mode #0c0d11).
- **Violet Wash** (#f2ecfe; dark #241b3d): the tinted panel for the current/preferred state (active nav link, voted badge, "latest version", the request band).

### Secondary
- **Data Amber** (#b45309; dark #fbbf24): reserved for the "most downloaded" flame moment and the warm statuses (warning / under review). Never replaces the violet action role.

### Neutral
- **Paper** (#fbfbfa; dark background #0c0d11): the breathing room.
- **Surface** (#ffffff; dark #15171e): cards, inputs, panels.
- **Surface Raised** (#f4f4f2; dark #1c1f28): secondary fill, image placeholders, hovers on ghost controls.
- **Ink** (#14151a; dark #f3f4f6): text and icons.
- **Ink Muted** (#5b6070; dark #a2a7b4): secondary text, meta, labels.
- **Line** (#e3e3df; dark #262a34) and **Line Strong** (#d2d2cc; dark #333846): hairline borders and the one emphasis border.
- Semantic: Success #15803d/#4ade80, Danger #dc2626/#f87171, Info #1d4ed8/#7ba2ff.

### Named Rules
**The One Accent Rule.** Route Violet is used only where the visitor can do something — the primary action, a link, focus, active nav, a pressed vote. It never decorates. Its rarity is what makes "download" impossible to miss.

**The Tabular Data Rule.** Every count, version number, and date reads with `tabular-nums`, so columns of downloads and votes stay calm and comparable row to row.

## Typography

**Display/body:** Cairo (Arabic + Latin) with Inter (Latin) — Cairo carries both scripts with a warm, confident geometry; Inter keeps Latin tight where Cairo doesn't need to.

**Character:** Arabic reads natively with graceful strokes; Latin pairs as a quieter, precise cousin. Headlines are bold and tight-tracked for a journal masthead feel; body sets loose and airy (1.6) within the 65–75ch measure.

### Hierarchy
- **Display** (700, clamp(2.25rem, 5vw, 3.5rem), 1.05, -0.03em): Home-page hero only, on its own with the search directly beneath.
- **Headline** (700, clamp(1.875rem, 4vw, 2.25rem), 1.1, -0.02em): Page titles — Games, a game, Request.
- **Title** (600, 1.25rem, 1.25, -0.01em): Section headers with an icon lead.
- **Body** (400, 1rem, 1.6): Descriptions, notes, paragraphs; measure 65–75ch.
- **Label** (600, 0.75rem, 0.06em, uppercase where used as overline): Field labels, section overlines, small meta (dates, versions).

## Layout

A centered container (max ~1152px) with generous vertical pacing (py-12/14/16 sections) and a 4px-based spacing rhythm: gap-2/3/4 in cards, gap-8 column gutters, grid of 2 → 3 → 4 cards crossing 640/1024px. Cards hold density high: 3–3.5 gap, cover-first, meta pinned to the card bottom. The catalogue page adds a toolbar row (search field flex-1 left, sort control right) then a quiet "results: N" line; pagination is a centered pill row. Detail pages use `lg:grid-cols-[320px_1fr]` with the sticky cover left; the version block sits full-width below.

RTL and LTR are literal mirrors: logical properties everywhere (padding-inline, text-start), explicit `rtl:` variants to flip chevrons and arrows, dir-dependent font family via `html[dir="rtl"] body` (Cairo vs Inter).

**The Search-First Rule.** The first thing a returning visitor hits on the home page after the headline is the working search; wherever a catalogue appears, search and sort live above the grid, never below it.

## Elevation & Depth

Paper-and-line: depth is created by hairline borders (#e3e3df) and a single tonal step (surface / surface-raised), not by shadows. Shadows are a response to state, never a resting property of a surface.

### Shadow Vocabulary
- **Lift** (`0 10px 24px -8px rgba(24, 26, 41, 0.14)`): only on interactive cards you can currently press (game card hover), plus a faint ambient under the hero search.
- Modals/popovers would use a stronger, structural shadow; none are shipped yet — do not invent resting shadows before that need exists.

### Named Rules
**The Line-Not-Shadow Rule.** A flat surface at rest is separated by its hairline border. If a card floats, it is telling the visitor it can be acted on — keep that meaning rare and intentional.

## Shapes

Two radii carry the system: **card corners (14px)** for surfaces that hold content (cards, panels, list containers, the request band) and **control corners (10px)** for anything the visitor presses or types into (buttons, inputs, selects, tab-like toggles). **Pills (999px)** are the third shape, reserved for badges, status chips, and the hero search form. Every corner is a gentle, un-fussy rounding — nothing sculpted, nothing sharp.

Covers are always **3:4**, the one silhouette the catalogue repeats, so a wall of games reads as a consistent shelf.

## Components

### Buttons
- **Shape:** control radius (10px); icons 16px, gap 8px.
- **Primary:** Route Violet, white text (44px tall default, 48px large, 36px small). Focus ring = route violet.
- **Hover:** Violet Deep (60px darker); disabled = 50% opacity, no pointer.
- **Secondary:** white on paper line, ink text, raised fill on hover.
- **Ghost:** text-only, raised fill on hover — used for quiet links/actions.
- **Danger:** red, white text, reserved for destructive confirmation.

### Badges / Chips
- **Style:** pill (999px), 12px medium text with 2px/10px padding.
- **Tones:** neutral (raised fill, muted text), accent (violet wash, Route Violet text — "Latest version", voted), plus success/warning/danger/info tinted fills for statuses.

### Cards / Containers
- **Corner Style:** card radius (14px).
- **Background:** white surface; grid cards get a raised-fill image area (3:4).
- **Shadow Strategy:** none at rest; Line border; **Lift** on game-card hover only.
- **Border:** 1px Line hairline.
- **Internal Padding:** 12–16px; list rows 14px/16px.

### Inputs / Fields
- **Style:** white surface, Line 1px border, control radius (10px), 44px tall, 14px placeholder text.
- **Focus:** route violet border + a soft violet 2px ring (35% mix).
- **Error:** danger text line beneath; **selection** and **caret** inherit violet.

### Navigation
- **Header:** hairline bottom border; brand wordmark (LogoMark eye mark) start-side, controls (language switcher, theme toggle) end-side, and the signed-in user sheet with admin entry when allowed.
- **Admin nav:** quiet muted links that become violet-wash + Route Violet for the current page; the active state follows the same rule as a pressed action.

### Game Card
- 3:4 cover, optional version chip (accent wash + backdrop-blur) pinned top-start, title 2-line clamp, then a pinned meta row: download count (tabular, paper-muted) with the "no version yet" hint. Hover: 2px rise + **Lift** shadow + 3% cover zoom.

### Download Button
- The surface's most important action: Primary violet, download icon + label + tabular count in parentheses. It is a hard link to `/api/download/[versionId]` — no JS required, the server counts and redirects.

## Do's and Don'ts

### Do:
- **Do** lead public views with the working search — it is the fastest path to the visitor's game.
- **Do** keep violet scarce: it marks the action spot, nothing else.
- **Do** render every count and version number with tabular numerals.
- **Do** give both languages equal fidelity, including mirrored chevrons and layout via logical properties.
- **Do** honor `prefers-reduced-motion` with the shared reduced-motion block.

### Don't:
- **Don't** import dark-neon gaming tropes — glitch type, heavy gradients, or a neon glow palette.
- **Don't** let cards rest on shadows; separation is a hairline at rest and lift only on press-ready states.
- **Don't** use amber for interactive actions — it designates warm data (most-downloaded, warnings), while violet handles every action.
- **Don't** break the 3:4 cover silhouette on catalogue cards.
- **Don't** add more than one authored entrance animation per viewport.