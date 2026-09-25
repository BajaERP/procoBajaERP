# ProcoBaja ERP — Frontend Agent Guide

React + Vite + Tailwind v4 frontend shell. Currently ships the layout chrome (Sidebar, TopBar, Shell) and 7 placeholder routes. Backend (Spring Boot) integration is the next milestone.

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
├── App.tsx                 # <RouterProvider router={router} />
├── main.tsx                # React 19 StrictMode entry, mounts to #root
├── styles.css              # Tailwind import + @theme design tokens
├── app/
│   ├── Shell.tsx           # Layout: Sidebar + TopBar + <Outlet/>
│   └── routes.tsx          # createHashRouter route table
├── components/
│   ├── Sidebar.tsx         # Collapsible left nav (64↔240px)
│   ├── TopBar.tsx          # Breadcrumbs + title + search + actions
│   └── icons.tsx           # 18 inline SVG icon components
└── pages/                  # One stub per route (~8 lines each)
    ├── DashboardPage.tsx
    ├── EquipePage.tsx
    ├── AtividadesPage.tsx
    ├── FinanceiroPage.tsx
    ├── CompeticoesPage.tsx
    ├── DocumentacaoPage.tsx
    └── ConfiguracoesPage.tsx
```

## Styling

Tailwind v4 via `@tailwindcss/vite` (configured in `vite.config.ts`). **No `tailwind.config.*` or PostCSS config** — Tailwind v4 reads `@theme` directly from CSS.

`src/styles.css` defines the design tokens:

```css
@import 'tailwindcss';
@variant dark (&:where(.dark, .dark *));
@theme {
  --font-sans: 'DM Sans', ...;
  --font-mono: 'JetBrains Mono', ...;
  --color-navy-{950..100}: ...;   /* navy palette */
  --color-accent: #2563eb;
  --color-accent-light: #eff6ff;
}
```

Fonts are loaded in `index.html` via Google Fonts. `index.html` sets `lang="pt-BR"` and `theme-color: #0f1729`.

## Routing

Hash router (URLs look like `/#/app/equipe`). All app routes live under `/app/*` so the Sidebar + TopBar chrome wrap them.

| Path | Component |
|---|---|
| `/` | redirect → `/app/dashboard` |
| `/app` | `<Shell>` (layout) |
| `/app/dashboard` | `DashboardPage` |
| `/app/equipe` | `EquipePage` |
| `/app/atividades` | `AtividadesPage` |
| `/app/financeiro` | `FinanceiroPage` |
| `/app/competicoes` | `CompeticoesPage` |
| `/app/documentacao` | `DocumentacaoPage` |
| `/app/configuracoes` | `ConfiguracoesPage` |

`Shell.tsx` derives the active sidebar item from `location.pathname.replace('/app/', '')`.

## Key Components

- **`Sidebar`** — navy-900 background, accent highlight on active item, collapsible 64↔240px, hardcoded placeholder user footer (`Admin ProcoBaja`).
- **`TopBar`** — white background, breadcrumbs + page title, search input (visual only), notifications bell with badge `3`, help icon, avatar matching Sidebar user.
- **`Shell`** — flexbox layout (`h-screen`), wires `Sidebar` + `TopBar` + `<Outlet/>`, drives active state and breadcrumbs from the active route.

## Backend Integration (Spring Boot)

A Spring Boot service lives at the workspace root: `/home/batnabat/projects/procoBajaERP/backend/`. **The frontend currently has zero API calls.** When the backend is ready, the wiring points are:

| Where | Currently | Replace with |
|---|---|---|
| `Sidebar.tsx` `PLACEHOLDER_USER` const | hardcoded admin | `useAuth()` (to be added) |
| `TopBar.tsx` `PLACEHOLDER_USER` const | hardcoded admin | same auth context |
| `TopBar.tsx` notifications badge | hardcoded `3` | fetch unread count from API |
| `src/pages/*.tsx` | stub `Em construção` | real page content driven by API |

Add a `src/lib/api.ts` (fetch wrapper, base URL from `import.meta.env`) and a `src/contexts/AuthContext.tsx` for user/session state.

## Conventions

- **Labels**: Portuguese (pt-BR), hardcoded inline. No i18n yet.
- **Theme**: light only. Dark tokens exist in CSS (`@variant dark`) but no toggle is wired — flip `.dark` on `<html>` to enable.
- **Nav**: single flat list of 7 items in `Shell.tsx`. No role-based filtering, no DEV switcher.
- **Routing**: always add new routes under `/app/*` so they share the Shell layout.
- **Icons**: use the inline SVGs in `src/components/icons.tsx`. Do NOT add an icon library dependency.

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

**Add a new design token:** edit the `@theme` block in `src/styles.css`. Tailwind v4 picks up new `--color-*`, `--font-*`, `--spacing-*`, etc. automatically.

**Change active-state logic:** edit the `activeId` derivation in `Shell.tsx` (`location.pathname.replace('/app/', '')`).

**Enable dark mode:** add a toggle that flips the `dark` class on `<html>`. The `@variant dark (&:where(.dark, .dark *));` selector is already in place.
