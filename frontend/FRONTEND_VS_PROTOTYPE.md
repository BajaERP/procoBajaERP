# Frontend vs Figma Prototype — Quick Diff

Concise comparison of the real frontend (`/frontend/src/`) against the Figma-driven reference prototype (`/frontend/prototipacao_erp_procobaja/`).

The real implementation is intentionally iterative — it ships the auth flow + gestor landing module first, then adds feature pages as the Spring Boot backend lands. The prototype is a design exploration spike; it is not the production reference.

## 1. Scope

| | Real | Prototype |
|---|---|---|
| Pages | 10 (Welcome, Login, Gestão + 7 stubs) | 18 pages |
| Page types | Auth flow + 1 gestor dashboard + 7 feature stubs | 6 role dashboards + 8 feature pages + Welcome + Login + Components showcase |
| Auth flow | Welcome → Login → `/app/gestao` (stubbed auth) | Welcome → Login → role-based dashboard (mocked roles) |

## 2. Nav Structure

| | Real | Prototype |
|---|---|---|
| Items | 8 flat items, ordered with Gestão at top | 6 roles × `NAV_BY_ROLE` grouped configs |
| Source of truth | `NAV` const in `src/app/Shell.tsx` | `NAV_BY_ROLE` in `src/app/Shell.tsx` |
| DEV role-switcher bar | absent | amber bar across the top |
| Gestão item | `ShieldIcon` placeholder, route `/app/gestao` | role-only nav config (`gestor` sees a Gestão group) |

## 3. User State

| | Real | Prototype |
|---|---|---|
| Source | `useAuth()` from `AuthContext` (persisted in localStorage) | `AppContext` (in-memory) drives the same hardcoded look |
| Roles | type union of 6 roles in `AuthUser`, but login always stubs `gestor` for now | 6 roles selectable via DEV switcher |
| Sidebar/TopBar user | both read from `useAuth()` | hardcoded look |
| Duplication risk | none | yes — `AppContext.tsx` exists twice (root + `contexts/`) |

## 4. i18n

| | Real | Prototype |
|---|---|---|
| Setup | none — labels are hardcoded Portuguese strings | `useT()` hook + pt/en dictionary in `src/i18n/index.ts` |
| Duplicate dict | n/a | yes — `src/translations.ts` is a near-duplicate missing some `common.*` keys |

## 5. Theming

| | Real | Prototype |
|---|---|---|
| Mode | light + dark + system via `ThemeContext` | light + dark via `<html class="dark">` toggle in `AppContext` |
| Palette | **Pinterest-aligned, red-led**: 6-step red scale (`red-tint`/`red-soft`/`red-light`/`red`/`red-pressed`/`red-deep`), warm-cream neutrals (`#fbfbf9`, `#f6f6f3`, `#e5e5e0`), ink/body/mute/ash text tier, hairline borders. Brand presence: 4px red left strip on sidebar + red avatar in TopBar/Sidebar. Placeholder hexes pending final brand colors. | navy + blue accent (`#2563eb`) + slate chrome |
| Dark mode | **Pure-black dominant**: `#0a0a0a` page bg → `#141414` card → `#050505` sidebar/TopBar. Borders `#262626`. Red CTAs pop against near-black. | warm-near-black `#262622` only |
| Dark tokens | defined and used (`@variant dark` in `src/styles.css` + `dark:` utilities across all components) | fully wired, used by all 18 pages |
| Toggle UI | **Configurações → Aparência 3-card picker only** (TopBar icon + profile menu item removed per DESIGN.md alignment) | single toggle in TopBar |
| Inline bootstrap | yes — `index.html` reads `localStorage.proco.theme` before React mounts to prevent white flash | not present |
| 3-way picker (Sistema) | yes | no — only light/dark |

The real frontend's visual language is aligned with [`DESIGN.md`](./DESIGN.md) — single accent, hairline borders (no card shadows), restrained radius vocabulary. Theme tokens and discipline are documented in `AGENTS.md → Design System`.

## 6. Routing

| | Real | Prototype |
|---|---|---|
| Router | `createHashRouter` | same |
| Routes | 12 (`/` + `/login` + 9 under `/app/*` + catchall) | 13 (6 role dashboards + 8 features + index redirect) |
| Welcome/Login | full flow (WelcomePage + LoginPage), no zoom animation | full flow with logo zoom animation between them |
| Auth guard | `ProtectedRoute` wraps the `/app` parent route | none — routes assume mock auth |
| Default after login | `/app/gestao` | role-specific dashboard |
| 404 behaviour | catchall `*` redirects to `/` | none |

## 7. Logo

| | Real | Prototype |
|---|---|---|
| Component | `LogoMark` + `LogoFull` in `src/components/Logo.tsx` | same |
| Tone handling | `tone="light"\|"dark"` swaps fill + monogram color so the mark stays legible on white and dark backgrounds | hardcoded colors (designed for dark bg) |

## 8. Gestao Module (`/app/gestao`)

The real implementation extends the prototype's `GestorDashboard` with a 4th tab and tone-tweaks for dark mode.

| Tab | Real | Prototype |
|---|---|---|
| Membros | members table + observation side panel (interactive: add observation) | same |
| Presenças | table with progress bars + status chips | same |
| Reuniões | cards with per-member present/absent chips | same |
| Subsistemas | **new** — 4 cards (Chassis, Motor, Dinâmica, TI) with team size, avg presence %, critical count | not present |

The módulo is structured so that additional gestor responsibilities (auditoria, relatórios, etc.) can be added either as more tabs or as sub-routes under `/app/gestao/*` when they land.

## 9. Orphans in the Prototype

These files exist in the prototype but are **not** wired into its router:

- `src/pages/DashboardPage.tsx` — generic English KPI page (`Total Revenue` etc.), leftover from a pre-router era.
- `src/pages/RHPage.tsx` — Portuguese HR page, also unrouted.

If you want either as a starting point for a real page, copy the file into `/frontend/src/pages/` and wire it up properly. Do NOT delete them from the prototype.

## 10. Intent

| Real | Prototype |
|---|---|
| Ship the auth flow + landing module for gestores first; add feature pages as backend lands. | Design exploration / Figma-Make spike. Useful for visual fidelity, not for production behavior. |

## When to Use Which

- **Need the layout structure, design tokens, or icon SVGs?** Both have them. Prefer the real implementation — it's what you'll ship.
- **Need a worked example of a page with tables, filters, modals?** Look in the prototype (e.g. `CapitaoDashboard.tsx` for table CRUD).
- **Need a role-based nav config?** The prototype's `NAV_BY_ROLE` is the reference, but only reintroduce role logic when the backend has actual roles.
- **Need dark mode pattern?** The real `ThemeContext` is the canonical example (with the inline bootstrap and 3-way picker in Configurações).
- **Need a worked example of the design discipline (radius, shadows, color tiers)?** See `AGENTS.md → Design System` and `DESIGN.md`. Cards have hairline borders only — no drop shadows.
- **Need the Gestao layout pattern?** Look in `src/pages/GestaoPage.tsx` first — the prototype's `GestorDashboard.tsx` is its source.
