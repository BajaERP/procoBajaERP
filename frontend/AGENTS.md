# ProcoBaja ERP — Frontend Guide

Frontend React + Vite + TypeScript + Tailwind CSS v4. The integrated app is
still a prototype: Gestão uses in-memory demonstration data, while Dashboard,
Equipe, Atividades, Financeiro, Competições and Documentação are placeholders.

## Stack and commands

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript 7 |
| Build | Vite 8 |
| Styles | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | `react-router-dom` 6 with `createHashRouter` |

Run commands from `frontend/`:

```bash
npm run dev
npm run build
npm run preview
```

## App structure

- `src/app/`: hash routes, authenticated demo shell and mobile navigation.
- `src/components/`: sidebar, top bar, logo, icons and shared placeholder.
- `src/contexts/`: local demonstration session and theme preference.
- `src/pages/`: Welcome, Login, Gestão, Configurações and placeholder routes.
- `src/styles.css`: Tailwind v4 tokens, dark-mode tokens and global behavior.

Routes live under `/app/*`. The default post-login destination is Gestão;
protected deep links are restored after the demonstration form is submitted.

## Current backend and session limits

The Spring Boot service has no application API or authentication endpoints yet.
`AuthContext` accepts any non-empty RA and password and stores a local demo
session. This is only for previewing the interface; it is not authentication,
authorization or a security boundary. Do not present client-side state as
protection for financial or personal data.

## UI conventions

- Preserve the ProcoBaja logo, red palette, DM Sans and JetBrains Mono.
- Support layouts from 320 px upward. The sidebar becomes a keyboard-operable
  drawer on narrow screens; dense tables scroll inside their own region with a
  visible scrollbar where the platform supports it.
- Keep button and text-entry targets at least 44 px high; icon-only buttons
  should also be at least 44 px wide.
- Use one KPI column on mobile, two on tablet and four on desktop.
- Keep light/dark colors legible through the semantic tokens in `styles.css`;
  add explicit dark variants to semantic status colors.
- Use `rounded-md`, `rounded-lg`, `rounded-2xl` only for the login card, and
  `rounded-full`. Avoid arbitrary radii and card shadows.
- Keep labels in Brazilian Portuguese. Use the inline SVGs in
  `src/components/icons.tsx`; do not add an icon dependency.

## Figma reference

`prototipacao_erp_procobaja/Prototipação ERP ProcoBaja.zip` is a read-only
design reference. It is separate from the integrated frontend; do not edit
the ZIP or treat its screens as implemented routes.
