# procoBaja ERP — Design System

> Authoritative source for visual decisions in this codebase. Reflects the
> real brand tokens (derived from `procobaja-logo.svg`) and the components
> actually in use. Update here first; treat code as the second source of truth.

## Overview

procoBaja is a Baja SAE racing team. The ERP is an internal tool for
gestores (managers) to coordinate the team across subsistemas (powertrain,
suspension, electronics, finances, etc.), presenças (attendance), reuniões
(meetings), and members. The visual language is disciplined and
brand-led — red is the only saturated color, everything else is monochrome
neutral — so the chrome never competes with operational data.

The system has three surface modes:

- **Welcome / Login** — full-bleed wallpaper + centered boar logo. No
  chrome. Brand-first, content-empty.
- **Authenticated app** — Sidebar (collapsible 64↔240px) + TopBar (56px)
  + main content. Cream wash in light mode (`bg-surface-soft`), pure-black
  dominant in dark mode (`bg-surface-dark`). Cards sit on `bg-canvas` with
  1px hairlines, no shadows.
- **Modals / popovers** — `bg-canvas` cards on top of a scrim, with shadow
  reserved exclusively for floating UI.

The signature gesture is the **boar logo mark** — a white boar silhouette
on a deep-red square (`#850305`). It anchors every chrome moment (welcome,
login card, sidebar header, sidebar footer). It is never decorative chrome
over data.

**Key characteristics:**
- **Single-accent palette**: procoBaja red leads every primary action;
  everything else is monochrome neutral.
- **Flat with hairlines**: cards and panels carry visual weight through
  1px borders, never drop shadows. Shadows are reserved for floating UI.
- **Pure-black dark mode**: `#0a0a0a` page → `#141414` cards → `#050505`
  chrome — a deliberate depth stack that anchors Sidebar/TopBar.
- **DM Sans typography** across every text role from 11px captions to
  30px display headlines. JetBrains Mono for codes, IDs, financial values.
- **Boar logo as the brand chip**: a deep-red square with the white boar
  silhouette. Replaces the red PB-monogram square that this codebase
  used as a placeholder.

## Colors

> **Source:** `procobaja-logo.svg` (viewBox 733×733). Three colors: deep
> red bg `#850305`, mid-red accent curves `#e33738`, white boar `#ffffff`.
> Everything else in the system derives from these.

### Brand & Accent

The red scale is a six-step ramp from pale wash to deepest brand strip,
derived directly from the logo so red can show up as a pale wash, a hover
state, a brand border, a primary CTA, or a deep accent without ever
colliding with neutrals. Defined in `@theme` of `src/styles.css`.

| Token | Hex | Use |
|---|---|---|
| `red-tint` | `#fdf2f3` | Palest pink wash. Empty-state backgrounds, very-light tinted panels. |
| `red-soft` | `#fbd9dc` | Light hover backgrounds, chip fills, "selected" pill bg. |
| `red-light` | `#e33738` | Mid accent — the lighter curve in the logo. Decorative use only. |
| `red` | `#850305` | **Brand primary** — the deep red from the logo bg. Primary CTAs, brand strip, notification badges, active-state text/icons. |
| `red-pressed` | `#6b0304` | Pressed / active state for red CTAs (one notch deeper than primary). |
| `red-deep` | `#4a0203` | Deepest brand strip. Heavy emphasis, deep brand border. |

**Brand presence rules.** Red shows up across the chrome, not just on
buttons:

- Sidebar carries a 4px `border-l-4 border-red` strip (always visible).
- TopBar / Sidebar user footer / notification badge all use `bg-red`.
- Active sidebar item: red text on `bg-red/5` wash with a small red dot
  indicator on the right edge.
- Primary CTAs and active tabs use `bg-red`.
- The boar logo IS the brand chip — it carries `#850305` natively, so
  every chrome moment that displays the logo inherits the brand red
  automatically.

### Surfaces (light mode — warm cream Pinterest-derived neutrals)

The neutral palette is deliberately warm-cream so the page never looks
sterile-corporate. Reds against cream reads warmer than reds against
pure white.

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#ffffff` | True white. Primary card / panel surface. Modal bg. |
| `surface-soft` | `#fbfbf9` | Faintly cream-tinted off-white. Page body wash, table row hover, input field bg. |
| `surface-card` | `#f6f6f3` | Warm-cream secondary cards / chips / category tiles. |
| `secondary-bg` | `#e5e5e0` | Secondary button fill, progress-bar track, badge bg. |
| `hairline` | `#dadad3` | 1px card / panel border — the dominant surface treatment. |
| `hairline-soft` | `#e5e5e0` | 1px inline divider inside cards. Doubles as the secondary-button bg. |

### Surfaces (dark mode — pure-black dominant)

| Token | Hex | Use |
|---|---|---|
| `surface-dark` | `#0a0a0a` | Page bg. |
| `surface-card-dark` | `#141414` | Card bg — slightly elevated from page. |
| `surface-chrome-dark` | `#050505` | Sidebar / TopBar. Deeper than page so chrome anchors. |
| `hairline-dark` | `#262626` | 1px borders on dark surfaces. |

### Text tier (ink → ash)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#000000` | Primary headings, table data, button text on light bg. |
| `body` | `#33332e` | Secondary body text, table cells. |
| `mute` | `#62625b` | Captions, helper text, metadata. |
| `ash` | `#91918c` | Placeholders, disabled text, least-emphasis hints. |
| `white` | `#ffffff` | Primary text on red / dark surfaces. |

### Semantic colors

Status colors are Tailwind built-ins, not custom tokens — they stay
disconnected from brand red so a "high priority" badge and a "primary
CTA" don't visually collide.

| Role | Tailwind class | Notes |
|---|---|---|
| Error | `text-red-600` | Inline error messages. |
| Severity / status badges | `bg-red-50 text-red-700`, `bg-red-500` | Crítico badge, severidade chips. Reserved for semantic state, never for brand. |
| Success | Tailwind `green-*` family | Reserved for future use. |
| Warning | Tailwind `amber-*` family | Reserved for future use. |

## Typography

### Font family

**DM Sans** is the UI face across every text role — geometric sans,
weights 400 / 500 / 600 / 700. Loaded in `index.html` via Google Fonts
along with `JetBrains Mono` (weights 400 / 500). JetBrains Mono is reserved
for codes, IDs, financial values, and any monospace context.

The CSS `@theme` block defines `--font-sans` and `--font-mono`, used by
Tailwind's `font-sans` and `font-mono` utilities.

### Hierarchy

The system is intentionally narrow — this is an ERP, not a marketing site.
No 70px display headlines. Hierarchy lives between 11px captions and 30px
page titles, with body sitting at 14–16px.

| Role | Size | Weight | Use |
|---|---|---|---|
| `text-3xl` | 30px | 600 | Page title (welcome "PROCO BAJA" lockup). |
| `text-2xl` | 24px | 700 | Welcome wordmark. |
| `text-xl` | 20px | 600 | Section heading inside a page. |
| `text-lg` | 18px | 600 | Card title. |
| `text-base` | 16px | 400 | Body copy, default paragraph. |
| `text-base` strong | 16px | 600 | Form label, primary nav link. |
| `text-sm` | 14px | 400 | In-grid metadata, table cells, helper text. |
| `text-sm` strong | 14px | 700 | Search-result count, table-header text. |
| `text-xs` | 12px | 500 | Caption text, badge label. |
| `text-xs` strong | 12px | 700 | Compact pill button label. |
| `text-[11px]` | 11px | 600 | Field label (uppercase, tracking-wide). |
| `text-[10px]` | 10px | 700 | Microcopy (e.g., badge count). |

### Tracking & uppercase

- Uppercase + tracking-wide (`tracking-widest` = 0.1em) is reserved for
  microcopy that wants institutional gravitas — the welcome subtitle,
  login "ACESSE SUA CONTA" prompt, field labels, sidebar footer role label.
- Body copy sits at default tracking. Do not add letter-spacing on body.
- Display wordmarks ("PROCO BAJA") use `tracking-[0.15em]` so the
  all-caps treatment feels weighted.

## Layout

### Spacing

4 / 8 / 12 / 16 / 24 / 32 rhythm — Tailwind defaults. Page-internal
gaps: `space-y-6` (24px) or `space-y-8` (32px). Tighter only inside
dense tables (`space-y-1`).

Card padding:
- KPI tile: `p-5` (20px)
- Section panel: `p-6` (24px)
- Full-page form / login card: `p-8` (32px)
- Modal / popover card: `p-4` or `p-6` depending on density

### Grid & container

- App shell: flexbox, `h-screen`, Sidebar (left) + main column (TopBar + Outlet).
- Main content: max-width depends on the page; no global container wrapper
  — each page owns its own width.
- KPI row: 4-column flex / grid at desktop, 2-up at tablet, 1-up at mobile.
- Data tables: full-width, fixed layout, no horizontal scroll until content
  forces it.

### Chrome dimensions

- Sidebar: `width: collapsed ? 64 : 240` (px). Transition 200ms ease.
- TopBar: `height: 56px` (`h-14`).
- Sidebar header: `h-14`, same as TopBar so vertical alignment reads clean.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Default for cards, panels, KPI tiles, table containers, sidebar/TopBar chrome. |
| 1 — Hairline border | 1px solid `hairline` (light) or `hairline-dark` (dark) | Inputs, in-list rows, in-card dividers, modal cards. |
| 2 — Modal scrim + soft shadow | Modal sits on a soft scrim over the page content with a soft shadow | Login modal, future modals. |

The system has **effectively no shadow elevation on content surfaces**.
Cards sit flat on the canvas; the only shadow appears on the modal layer.

### Floating UI only

Shadows are reserved exclusively for:
- The TopBar profile menu dropdown
- Future popovers, modals, tooltips
- Notification dropdown (when added)

**Forbidden** on: cards, panels, KPI tiles, table containers, sidebar /
TopBar chrome, button rest states. If a card needs visual weight, add a
border — don't raise it.

## Shapes

### Border radius

Four values in active use. Pick from the list; don't invent new ones.

| Class | Value | Use |
|---|---|---|
| `rounded-md` | 6px | Small controls — icon buttons, chips, search field, divider dots. |
| `rounded-lg` | 8px | Default card / panel / section radius. KPI tiles, table containers, sidebar items. |
| `rounded-2xl` | 16px | Modal-style cards only — login form card. |
| `rounded-full` | 9999px | Pills, avatars, notification badge, profile menu trigger. |

### Geometry notes

- The logo is **always square**. Render at the height requested and let
  width auto-derive. The transparent boar variant (used on dark chrome)
  is wider than tall (native aspect 565:443); treat `size` as height for
  that variant.
- Avatar circles are 28px (`w-7 h-7`) at `rounded-full` in the sidebar
  footer — used for the boar logo as a brand anchor.

## Components

### Logo (`src/components/Logo.tsx`)

**`LogoMark`** — the boar logo. Two variants:

- `variant="solid"` (default): the boar on a deep-red square background.
  Use standalone on welcome (120px), login card (72px), sidebar header
  (28px), sidebar footer (28px). The logo carries its own `#850305` bg
  so it reads on any backdrop — no `tone` swap needed.
- `variant="transparent"`: the boar path only, white fill, transparent
  background. Use when sitting on a dark chrome surface where the red
  square would clash. Native aspect ratio 565:443 (wider than tall) is
  preserved automatically.

**`LogoFull`** — `LogoMark` + "PROCO BAJA" wordmark + "Sistema de Gestão"
subtitle. Optional composite, currently unused.

### Buttons

**Primary CTA** — universal brand action
- `bg-red hover:bg-red-pressed` text-white.
- `rounded-lg` for inline buttons, `rounded-2xl` for full-width form CTAs.
- `text-sm font-semibold` standard; `text-base` for hero CTAs.
- Used for: "Entrar" (login submit), future primary actions on
  formulário pages.

**Secondary** — gray-cream alternative
- `bg-secondary-bg text-ink hover:bg-hairline-soft`.
- Same shape vocabulary as primary.

**Tertiary / ghost** — link-like
- `bg-transparent text-ink hover:bg-surface-soft`.
- Used for low-emphasis actions inside dialogs ("Read the docs", "Learn more →").

**Icon button** — circular
- `p-2 rounded-md text-mute hover:bg-surface-soft`.
- Used in TopBar (notifications, help).

### Sidebar (`src/components/Sidebar.tsx`)

- 4px `border-l-4 border-red` strip on the left edge (always visible).
- Header (56px): boar logo (28px) + "Proco Baja" wordmark when expanded;
  just the logo when collapsed.
- Nav items: full-width buttons, `gap-3 px-4 py-2.5`, text-sm font-medium.
  Active state: `bg-red/5 text-red` wash + small `bg-red` dot on the right.
- User footer (border-t): boar logo (28px) + name + role when expanded;
  just the logo when collapsed.
- Collapsed toggle: chevron sits in the header (when expanded) or as a
  separate button below the header (when collapsed).

### TopBar (`src/components/TopBar.tsx`)

- `h-14 border-b border-hairline bg-canvas dark:bg-surface-chrome-dark`.
- Left: breadcrumbs (text-xs text-mute, slash separators) + page title
  (text-sm font-semibold text-ink).
- Center: search input (visual only, no logic yet). `w-60 rounded-md
  bg-surface-soft border-hairline`.
- Right: notification bell (`bg-red` badge with count) + help + profile
  menu trigger (28px `rounded-full bg-red` with user initials).
- Profile menu: 240px wide (`w-60`) dropdown with user info, Configurações
  link, Sair button (`text-red hover:bg-red/5`).

### Cards & surfaces

**KPI tile** — metric card on GestaoPage
- `bg-canvas dark:bg-surface-card-dark border border-hairline rounded-lg p-5`.
- Big number (text-3xl font-bold text-ink) + label (text-xs text-mute uppercase).
- 4-up at desktop, 2-up at tablet, 1-up at mobile.

**Section panel** — content grouping
- `bg-canvas border border-hairline rounded-lg p-6`.
- Hosts tab strips, tables, forms. The dominant content surface.

**Tab strip** — section navigation
- Underline-style: bottom border on active tab in `border-red text-red`.
- Pill-style (alternative): `rounded-md bg-surface-card` inactive,
  `bg-red text-white` active.

**Data table**
- `bg-canvas border border-hairline rounded-lg overflow-hidden`.
- Header row: `text-xs font-bold uppercase text-mute`.
- Body rows: `text-sm text-body`, hover `bg-surface-soft`.
- Row dividers: `divide-y divide-hairline-soft`.

### Forms

**Text input**
- `w-full px-4 py-2.5 rounded-xl border bg-surface-soft`.
- Focus: `border-red ring-2 ring-red/30` — red focus signal.
- Disabled: `opacity-50`.

**Label**
- `text-[11px] font-semibold uppercase tracking-wide text-mute`.
- Sits above the input with `space-y-1.5` gap.

**Error message**
- `text-xs text-red-600 font-medium` below the input.
- Uses Tailwind built-in `red-600` (NOT custom `--color-red`) so error
  text stays distinguishable from brand red.

### Navigation chrome

**Breadcrumbs** (TopBar)
- Slash-separated, `text-xs text-mute`, hover `text-body` on links.

**Nav items** (Sidebar)
- Icon + label, full-width button, `text-sm font-medium`.
- Active: `bg-red/5 text-red` + small red dot indicator.
- Inactive hover: `bg-surface-soft text-ink`.

## Do's and Don'ts

### Do

- Use `bg-red` (the brand primary) sparingly — primary CTAs, brand strip,
  notification badges, active state. Never decorative.
- Use `text-red` for active sidebar items, focus rings, and the Sair button.
  Pair with a background surface that has enough contrast (cream or white).
- Apply `dark:` variants on every colored utility (bg, text, border, divide)
  in new components. Card pattern: `bg-canvas dark:bg-surface-card-dark
  border-hairline dark:border-hairline-dark`.
- Reach for `rounded-lg` (8px) on every card / panel by default;
  `rounded-2xl` only for modal-style cards.
- Keep DM Sans for UI and JetBrains Mono for codes / IDs / numbers. Do
  not introduce a third face without deliberate reason.
- When a card needs visual weight, add a border. Do not raise with shadow.
- Use the boar logo as the brand anchor. `LogoMark` size 28px in
  Sidebar, 72px on Login, 120px on Welcome.
- Build hierarchy from font weight (400 → 500 → 600 → 700) and size, not
  from color tinting. Body stays `text-body` regardless of section context.

### Don't

- Don't introduce a new accent color. Red is the brand. Status colors
  (success / warning / error) live in Tailwind built-ins (green / amber /
  red-600) so they don't visually collide with brand red.
- Don't add card shadows. The hairline border is enough.
- Don't pad the TopBar profile menu beyond its current `w-60` width —
  it fits the longest name without truncation.
- Don't replace DM Sans with a different face without a deliberate reason.
- Don't introduce a 5th brand red value outside the scale in `styles.css`.
  The six steps are the entire ramp.
- Don't lighten dark mode. The pure-black stack (`#0a0a0a` page →
  `#141414` card → `#050505` chrome) is the contract. If a surface
  feels too dark, add a border or accent — don't raise the bg value.
- Don't use the placeholder hexagon (PB monogram on `#e60023`) anywhere.
  It has been replaced by the boar logo.

## Asset reference

- `src/assets/procobaja-logo.svg` — boar on deep-red square (733×733).
  Standalone use, sidebar chrome, welcome, login.
- `src/assets/procobaja-transparente.svg` — boar path only, transparent
  background (565×443, wider than tall). Use on dark chrome.
- `index.html` `<meta name="theme-color">` is set to `#850305` to match
  the brand primary.
- Logo colors `#850305` / `#e33738` / `#ffffff` are baked into the SVGs —
  no need to recolor at runtime.

## Iteration guide

1. New component → start from an existing card / panel / button pattern
   in this doc. Match its surface, padding, radius, font weight.
2. New color → extend the red scale in `@theme` of `styles.css` first,
   document it here second. Don't introduce values outside the scale.
3. New spacing → use Tailwind defaults (4 / 8 / 12 / 16 / 24 / 32).
   No arbitrary values.
4. New shadow → only on floating UI (modals, popovers, dropdowns).
   Never on cards.
5. When introducing a new component, ask whether it can be expressed
   with the existing card + hairline + rounded-lg vocabulary before
   adding new tokens.
