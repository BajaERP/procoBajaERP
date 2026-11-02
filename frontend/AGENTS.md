# ProcoBaja ERP — Frontend Guide

Frontend React + Vite + TypeScript + Tailwind CSS v4. The integrated app is
still a prototype: Gestão, Dashboard, Equipe, Atividades, Financeiro,
Competições and Documentação are placeholders.

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
npm run format       # Apply Prettier to frontend source and configuration
npm run format:check # Verify formatting without modifying files
```

## App structure

- `src/app/`: hash routes, authenticated demo shell and mobile navigation.
- `src/components/layout/`: sidebar and top bar shared by authenticated pages.
- `src/components/shared/`: reusable logo and placeholder components.
- `src/components/pages/login/` and `src/components/pages/configuracoes/`: page-specific sections.
  Keep components near their page until reuse justifies moving them to `shared/`.
- `src/pages/`: compose sections and coordinate route-level data and navigation.
- `src/contexts/`: local demonstration session and theme preference.
- `src/styles.css`: Tailwind v4 tokens, dark-mode tokens and global behavior.

Routes live under `/app/*`. The default post-login destination is Dashboard;
protected deep links are restored after the demonstration form is submitted.

## Current backend and session limits

The Spring Boot service has no application API or authentication endpoints yet.
`AuthContext` accepts a numeric RA and any non-empty password and stores a local demo
session. This is only for previewing the interface; it is not authentication,
authorization or a security boundary. Do not present client-side state as
protection for financial or personal data.

## UI conventions

- Format frontend source with Prettier: tabs with a display width of four columns.

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
- Keep labels in Brazilian Portuguese. Use icons from `lucide-react`; preserve the ProcoBaja logo assets.

## Figma reference

https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1&t=baEGJUvpkYT1JrQA-1
