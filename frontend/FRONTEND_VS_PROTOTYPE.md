# Frontend vs Figma Prototype — Quick Diff

Concise comparison of the real frontend (`/frontend/src/`) against the Figma-driven reference prototype (`/frontend/prototipacao_erp_procobaja/`).

The real implementation is intentionally minimal — it ships the layout shell first and adds features as the Spring Boot backend lands. The prototype is a design exploration spike; it is not the production reference.

## 1. Scope

| | Real | Prototype |
|---|---|---|
| Pages | 7 placeholder stubs | 18 pages |
| Page types | One generic stub layout | 6 role dashboards + 8 feature pages + Welcome + Login + Components showcase |
| Auth flow | none | Welcome → Login → role-based dashboard |

## 2. Nav Structure

| | Real | Prototype |
|---|---|---|
| Items | 7 flat items | 6 roles × `NAV_BY_ROLE` grouped configs |
| Source of truth | `NAV` const in `src/app/Shell.tsx` | `NAV_BY_ROLE` in `src/app/Shell.tsx` |
| DEV role-switcher bar | absent | amber bar across the top |

## 3. User State

| | Real | Prototype |
|---|---|---|
| Source | hardcoded `PLACEHOLDER_USER` const inside `Sidebar.tsx` and `TopBar.tsx` | `AppContext` (language + theme) drives the same hardcoded look |
| Duplication risk | none (single source) | yes — `AppContext.tsx` exists twice (root + `contexts/`) |

## 4. i18n

| | Real | Prototype |
|---|---|---|
| Setup | none — labels are hardcoded Portuguese strings | `useT()` hook + pt/en dictionary in `src/i18n/index.ts` |
| Duplicate dict | n/a | yes — `src/translations.ts` is a near-duplicate missing some `common.*` keys |

## 5. Theming

| | Real | Prototype |
|---|---|---|
| Mode | light only | light + dark via `<html class="dark">` toggle in `AppContext` |
| Dark tokens | defined but unused (`@variant dark` in `src/styles.css`) | fully wired, used by all 18 pages |
| Toggle UI | none | present in TopBar |

## 6. Routing

| | Real | Prototype |
|---|---|---|
| Router | `createHashRouter` | same |
| Routes | 7 under `/app/*` | 13 (6 role dashboards + 8 features + index redirect) |
| Welcome/Login | not implemented | full flow with zoom animation between them |

## 7. Orphans in the Prototype

These files exist in the prototype but are **not** wired into its router:

- `src/pages/DashboardPage.tsx` — generic English KPI page (`Total Revenue` etc.), leftover from a pre-router era.
- `src/pages/RHPage.tsx` — Portuguese HR page, also unrouted.

If you want either as a starting point for a real page, copy the file into `/frontend/src/pages/` and wire it up properly. Do NOT delete them from the prototype.

## 8. Intent

| Real | Prototype |
|---|---|
| Ship the layout shell first, wire features incrementally as backend lands. | Design exploration / Figma-Make spike. Useful for visual fidelity, not for production behavior. |

## When to Use Which

- **Need the layout structure, design tokens, or icon SVGs?** Both have them. Prefer the real implementation — it's what you'll ship.
- **Need a worked example of a page with tables, filters, modals?** Look in the prototype (e.g. `CapitaoDashboard.tsx` for table CRUD).
- **Need a role-based nav config?** The prototype's `NAV_BY_ROLE` is the reference, but only reintroduce role logic when the backend has actual roles.
- **Need dark mode?** The CSS is ready; add a toggle button. The prototype's `AppContext` is the pattern to copy.
