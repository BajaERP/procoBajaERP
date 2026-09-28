# ProcoBaja ERP — Frontend Agent Guide

React + Vite + Tailwind v4 frontend shell. Currently ships the auth flow (Welcome → Login → Shell), the management module for gestores (`/app/gestao`), the theme system (light/dark/system), and 7 placeholder feature routes. Backend (Spring Boot) integration is the next milestone — auth is currently stubbed via localStorage.

## Tech Stack

| Layer | Choice | Version |
|---|---|---|
| UI | React | 19.3.0 |
| Build | Vite | 8.3.0 |
| Language | TypeScript | 7.0.2 |
| Styling | Tailwind CSS | ^4.3.3 (via `@tailwindcss/vite`) |
| Router | react-router-dom | ^6.30.6 (`createHashRouter`) |
| Icons | custom inline SVG (no external lib) | — |

Node engine: `^20.19.0 || >=22.12.0`. Package manager: **npm** (lockfile at root).

## Scripts

```bash
npm run dev      # Vite dev server (port 5173)
npm run build    # tsc -b && vite build
npm run preview  # preview built bundle
```

## Project Structure

```
src/
├── App.tsx                 # <ThemeProvider><AuthProvider><RouterProvider/></AuthProvider></ThemeProvider>
├── main.tsx                # React 19 StrictMode entry, mounts to #root
├── styles.css              # Tailwind import + @theme design tokens + html/body theme base
├── app/
│   ├── Shell.tsx           # Authenticated layout: Sidebar + TopBar + <Outlet/>
│   ├── ProtectedRoute.tsx  # Redirects unauthenticated users from /app/* to /login
│   └── routes.tsx          # createHashRouter route table (incl. Welcome, Login, /app/*)
├── components/
│   ├── Logo.tsx            # Hexagonal placeholder mark + full lockup (tone="light"|"dark")
│   ├── Sidebar.tsx         # Collapsible left nav (64↔240px), reads user from AuthContext
│   ├── TopBar.tsx          # Breadcrumbs + title + search + theme toggle + profile menu
│   └── icons.tsx           # 22 inline SVG icon components (incl. Sun, Moon, Logout)
├── contexts/
│   ├── ThemeContext.tsx    # light/dark theme + localStorage + prefers-color-scheme fallback
│   └── AuthContext.tsx     # Stubbed login (no backend) + user persistence via localStorage
└── pages/
    ├── WelcomePage.tsx     # AFK default: logo on blank wallpaper, click/key → /login
    ├── LoginPage.tsx       # Email + password form, submit → /app/gestao
    ├── GestaoPage.tsx      # Gestão de Equipe e Subsistemas (gestor landing) — KPIs + 4 abas
    ├── DashboardPage.tsx   # stub
    ├── EquipePage.tsx      # stub (kept for future non-gestor view)
    ├── AtividadesPage.tsx  # stub
    ├── FinanceiroPage.tsx  # stub
    ├── CompeticoesPage.tsx # stub
    ├── DocumentacaoPage.tsx# stub
    └── ConfiguracoesPage.tsx # Aparência (3-way theme picker) + Conta + Notificações (placeholder)
```

## Styling

Tailwind v4 via `@tailwindcss/vite` (configured in `vite.config.ts`). **No `tailwind.config.*` or PostCSS config** — Tailwind v4 reads `@theme` directly from CSS.

`src/styles.css` defines the design tokens and the html/body theme base:

```css
@import 'tailwindcss';
@variant dark (&:where(.dark, .dark *));
@theme { /* navy palette, accent, fonts */ }
html, body { background-color: #fff; color: #0f172a; }
html.dark, html.dark body { background-color: #0a0f1e; color: #f8fafc; }
```

Fonts are loaded in `index.html` via Google Fonts. `index.html` also ships an inline bootstrap that reads `localStorage.proco.theme` and sets `.dark` on `<html>` before React mounts — this prevents the white flash on initial load.

## Design System

The visual language is aligned with the Pinterest design patterns documented in [`DESIGN.md`](./DESIGN.md) — disciplined, ERP-appropriate, no ornamentation. The exact brand colors are placeholders; the user will supply final values later. The discipline (single accent, hairline borders, restrained neutrals) is the contract — keep the pattern even when the specific hexes change.

### Color discipline

Red is the brand. Use it boldly but with discipline — red scale + monochrome everything else.

- **Red scale** — derived from `procobaja-logo.svg` (`#850305` bg + `#e33738` accent). Multiple variants so red can show up as a primary CTA, a hover wash, a brand border, or a deep accent without colliding with neutrals:
  - `red-tint` (`#fdf2f3`) — palest wash, empty-state bg
  - `red-soft` (`#fbd9dc`) — light hover bg, chip fill
  - `red-light` (`#e33738`) — mid accent (the lighter curve in the logo)
  - `red` (`#850305`) — brand primary (the deep red from the logo bg)
  - `red-pressed` (`#6b0304`) — pressed/active state
  - `red-deep` (`#4a0203`) — deepest brand strip, heavy emphasis
- **Brand presence** — the brand is felt across the chrome, not just on buttons:
  - Sidebar carries a 4px red `border-l-4 border-red` strip (always visible)
  - TopBar + Sidebar user avatars use `bg-red` (always visible)
  - Active sidebar item: red text on `bg-red/5` wash with a small red dot indicator
  - Primary CTAs and active tabs use `bg-red`
  - Notification badge uses `bg-red`

### Surfaces

Light mode (warm cream Pinterest palette):
- `bg-canvas` (`#ffffff`) — primary card / panel surface
- `bg-surface-soft` (`#fbfbf9`) — page wash, table row hover, input field bg
- `bg-surface-card` (`#f6f6f3`) — warm-cream surface for secondary cards / chips
- `bg-secondary-bg` (`#e5e5e0`) — secondary buttons, progress-bar tracks, badge backgrounds

Dark mode (pure-black dominant):
- `bg-surface-dark` (`#0a0a0a`) — page bg
- `bg-surface-card-dark` (`#141414`) — card bg, slightly elevated from page
- `bg-surface-chrome-dark` (`#050505`) — sidebar / TopBar, deeper than page so the chrome anchors
- `border-hairline-dark` (`#262626`) — borders on dark surfaces

### Text tier (ink → ash)

- `text-ink` (`#000000`) — primary headings, table data, button text on light bg
- `text-body` (`#33332e`) — secondary body text, table cells
- `text-mute` (`#62625b`) — captions, helper text, metadata
- `text-ash` (`#91918c`) — placeholders, disabled, least-emphasis hints
- `text-white` (`#ffffff`) — text on red/dark surfaces

### Borders & dividers

- `border-hairline` (`#dadad3`) — 1px card / panel border (the dominant surface treatment)
- `border-hairline-soft` (`#e5e5e0`) — 1px inline divider inside cards (e.g. row separators, table footer rules)

### Depth: flat with hairline borders

Cards and panels carry visual weight through a **1px hairline border**, never a drop shadow. Shadows are reserved for floating UI only:

- `shadow-*` is allowed on: dropdowns, popovers, modals (TopBar profile menu, future modals).
- `shadow-*` is forbidden on: cards, panels, KPI tiles, table containers, sidebar/TopBar chrome.

### Radius vocabulary

Three values. Pick from the list; don't invent new ones.

| Class | Use |
|---|---|
| `rounded-md` | Small controls — icon buttons, chips, search field |
| `rounded-lg` | Default card / panel / section radius |
| `rounded-2xl` | Modal-style cards only (login) |
| `rounded-full` | Pills, avatars, circular badges |

### Spacing & layout

- 4/8/12/16/24/32 rhythm — Tailwind defaults. Avoid arbitrary values.
- Section gaps inside a page: `space-y-6` or `space-y-8`. Tighter only inside dense data tables.
- Card internal padding: `p-5` for KPI tiles, `p-6` for sections, `p-8` for full-page forms.

### Don'ts

- Don't introduce new accent colors. Red is the brand. If a status needs color, use semantic emerald/amber/red — but reserve pure `bg-red` for brand moments; status red should be muted (`bg-red-50 text-red-700`).
- Don't add card shadows. The hairline border is enough.
- Don't pad the TopBar profile menu beyond its current `w-60` width — it fits the longest name without truncation.
- Don't replace DM Sans with a different face without a deliberate reason (display sizes need a tight geometric sans; Pin Sans is proprietary and DM Sans is the closest open substitute).
- Don't reintroduce navy, blue, or any non-Pinterest color. When the user provides exact brand colors, swap them into the `@theme` block of `styles.css` — the rest of the codebase picks them up via the token utilities.
- Don't lighten dark mode. The pure-black stack (`#0a0a0a` page → `#141414` card → `#050505` chrome) is the contract. If a surface feels too dark, add a border or accent — don't raise the bg value.

## Routing

Hash router (URLs look like `/#/app/gestao`).

| Path | Guard | Component |
|---|---|---|
| `/` | — | `WelcomePage` |
| `/login` | — | `LoginPage` |
| `/app` | `ProtectedRoute` → `<Navigate to="/app/gestao">` | `Shell` (index redirect) |
| `/app/gestao` | `ProtectedRoute` | `GestaoPage` |
| `/app/dashboard` | `ProtectedRoute` | `DashboardPage` (stub) |
| `/app/equipe` | `ProtectedRoute` | `EquipePage` (stub) |
| `/app/atividades` | `ProtectedRoute` | `AtividadesPage` (stub) |
| `/app/financeiro` | `ProtectedRoute` | `FinanceiroPage` (stub) |
| `/app/competicoes` | `ProtectedRoute` | `CompeticoesPage` (stub) |
| `/app/documentacao` | `ProtectedRoute` | `DocumentacaoPage` (stub) |
| `/app/configuracoes` | `ProtectedRoute` | `ConfiguracoesPage` |
| `*` | — | `<Navigate to="/">` |

`Shell.tsx` derives the active sidebar item from `location.pathname.replace('/app/', '')`.

## Auth & Theme Flow

### Welcome → Login → App

1. **AFK default** — `/` renders `WelcomePage`: full-bleed wallpaper (white in light, navy-950 in dark) + center logo. No shell, no nav.
2. **Wake event** — any `click` on the page or `keydown` on the window navigates to `/login`.
3. **Login** — `LoginPage` shows an email + password form. Submit calls `AuthContext.login()`, which currently stubs a user derived from the email (no backend yet — see "Backend Integration"). On success, the user is redirected to `/app/gestao`.
4. **Authed access** — `ProtectedRoute` guards every `/app/*` route. Unauthed users are sent to `/login` (with the attempted path remembered in `state.from`, for future "redirect back after login" behaviour).
5. **Logout** — TopBar profile menu → "Sair" clears the user and navigates back to `/`. Sidebar user footer also reflects the authed user (initials + role).

Already-authenticated users who visit `/` or `/login` are bounced straight to `/app/gestao`.

### Theme

`ThemeContext` exposes `{ theme, setTheme, toggleTheme }` and:

- Persists the user's choice in `localStorage` under `proco.theme` (`'light'` | `'dark'`).
- When no choice is stored, follows `prefers-color-scheme`.
- On mount, toggles the `.dark` class on `<html>`, which activates every `dark:*` utility in Tailwind (wired via `@variant dark (&:where(.dark, .dark *))`).

The theme is changed in exactly one place:

- **Configurações → Aparência** — three-card picker: `Claro`, `Escuro`, `Sistema` (clears localStorage and follows the OS).

The TopBar quick-toggle button and the "Tema claro/escuro" item in the profile menu were removed per design-system alignment (see `DESIGN.md`): theme is a deliberate preference, not a quick gesture, so it lives in settings only.

## Key Components

- **`WelcomePage`** — full-bleed `bg-white dark:bg-navy-950`, centers `LogoMark` + project name. Any click/key sends user to `/login`.
- **`LoginPage`** — card with `LogoMark`, email + password inputs, submit button. Submit redirects to `/app/gestao`.
- **`GestaoPage`** — landing module for gestores. Header + 4 KPI cards + 4 abas (Membros / Presenças / Reuniões / Subsistemas). Mock data inline (will move to API).
- **`Logo`** (`LogoMark`, `LogoFull`) — hexagonal placeholder mark with PB monogram. `tone="light"|"dark"` swaps the fill for legibility on white vs dark backgrounds.
- **`Sidebar`** — navy-900 (works in both themes), collapsible 64↔240px, user footer reads from `useAuth()`. Item highlight via accent.
- **`TopBar`** — `bg-white dark:bg-navy-900`, breadcrumbs + page title, search (visual only), notifications bell (`3` hardcoded), help, avatar with profile menu (configurações / sair).
- **`Shell`** — flexbox layout (`h-screen`), wires `Sidebar` + `TopBar` + `<Outlet/>`, drives active state and breadcrumbs from the active route. Nav now contains 8 items with `Gestão` at the top.
- **`ProtectedRoute`** — redirects unauthenticated users to `/login`. Used as the `element` for the `/app` parent route.

## Backend Integration (Spring Boot)

A Spring Boot service lives at the workspace root: `/home/batnabat/projects/procoBajaERP/backend/`. The frontend has no real API calls yet — auth is stubbed.

| Where | Currently | Replace with |
|---|---|---|
| `AuthContext.login()` | stubs a user from the email (`role: 'gestor'`) | `POST /auth/login` |
| `AuthContext.user` shape | `{ id, name, email, role, initials }` | keep; map from `/auth/me` |
| `AuthContext.logout()` | clears local state | call `/auth/logout`, then clear |
| `TopBar.tsx` notifications badge | hardcoded `3` | fetch unread count from API |
| `GestaoPage` mock data | inline constant `MEMBROS_INICIAIS` | `GET /api/gestao/equipe`, `GET /api/gestao/reunioes` |
| `EquipePage` and other stubs | stub `Em construção` | real page content driven by API |

Add a `src/lib/api.ts` (fetch wrapper, base URL from `import.meta.env`) once the first endpoint is ready. `AuthContext` is the only piece of session state right now; cookies/JWT refresh logic will need to slot in here.

## Conventions

- **Labels**: Portuguese (pt-BR), hardcoded inline. No i18n yet.
- **Theme**: light + dark + system, wired through `ThemeContext`. New components should include `dark:` variants on every colored utility (bg, text, border, divide). Card pattern: `bg-white dark:bg-navy-900 border-slate-200 dark:border-white/10`.
- **Nav**: flat list of 8 items in `Shell.tsx`, ordered by importance for gestores. No role-based filtering yet (gestor role is the only role with real content; others will land on `DashboardPage`).
- **Routing**: always add new authenticated routes under `/app/*` so they share the Shell layout AND get `ProtectedRoute` for free.
- **Icons**: use the inline SVGs in `src/components/icons.tsx`. Do NOT add an icon library dependency.
- **Placeholder logo**: `LogoMark` is a PB hex stamp meant to be replaced when the brand assets land. Don't pixel-tweak it.

## Reference: Figma Prototype

`/home/batnabat/projects/procoBajaERP/frontend/prototipacao_erp_procobaja/` — Figma-driven reference prototype with a fuller implementation: 18 pages, i18n (pt/en), dark mode toggle, role-based nav (6 roles + DEV switcher), component showcase. **Read-only — never modify files in this folder.** Visual fidelity is the source of truth for design decisions.

For a quick comparison of what the real implementation does vs the prototype, see [`FRONTEND_VS_PROTOTYPE.md`](./FRONTEND_VS_PROTOTYPE.md).

## Common Tasks

**Add a new sidebar item:**
1. Add entry to `NAV` in `src/app/Shell.tsx` (id, label, `to`, `icon` key)
2. Add the icon component to `ICON_MAP` in the same file
3. Add label to `ROUTE_LABELS` in the same file
4. Register the route in `src/app/routes.tsx`
5. Create a page stub in `src/pages/`

**Add a new protected page:**
1. Create `src/pages/MyPage.tsx` (default export).
2. Register it under `/app` in `src/app/routes.tsx` — the `ProtectedRoute` wrapper at the parent route guards it for free.
3. If it needs its own sidebar entry, follow the steps above.

**Add a new design token:** edit the `@theme` block in `src/styles.css`. Tailwind v4 picks up new `--color-*`, `--font-*`, `--spacing-*`, etc. automatically.

**Change active-state logic:** edit the `activeId` derivation in `Shell.tsx` (`location.pathname.replace('/app/', '')`).

**Switch the placeholder logo:** `src/components/Logo.tsx` exposes `LogoMark` (icon-only) and `LogoFull` (lockup). Both take a `tone` prop. Swap the SVG content for the real mark when assets land — keep the prop API so callers don't change.

**Wire a real auth call:** replace the body of `AuthContext.login()` with a `fetch('/api/auth/login', ...)` and update the `AuthUser` shape if the backend returns more fields. Nothing else in the app needs to change.
