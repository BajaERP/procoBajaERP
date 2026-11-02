# ProcoBaja ERP — Frontend

## Working in this directory

React, TypeScript, Vite and Tailwind CSS v4; see `package.json` for versions and Node requirements. Run commands from `frontend/`:

```bash
npm run dev           # local development server
npm run build         # TypeScript check and production build
npm run format        # apply Prettier
npm run format:check  # check formatting without modifying files
npm run preview       # preview the production build
```

After code changes, run `npm run format:check` and `npm run build`. There is no configured test script; exercise affected interactions in the browser when appropriate. Prettier uses tabs displayed at four columns.

## Structure and ownership

- `src/app/`: hash router, protected routes, authenticated shell and mobile navigation behavior.
- `src/pages/`: route-level composition and navigation.
- `src/components/pages/<page>/`: components specific to a page; move them to `shared/` when they are reused across pages.
- `src/components/layout/`: shared application shell components, including sidebar and top bar.
- `src/components/shared/`: reusable components such as the logo and placeholder.
- `src/contexts/`: demonstration session and theme preference.
- `src/styles.css`: Tailwind theme tokens, dark-mode values and global styles.

Routes are under `/app/*`; Dashboard is the default after login. Preserve protected deep-link restoration and the existing welcome-to-login transition when changing routing.

## Data and authentication

Most module pages are placeholders. The Spring Boot project has database migrations, but no application or authentication endpoints are connected to this frontend. `AuthContext` is a local demonstration: it accepts a numeric RA and any non-empty password. Do not treat this session or client-side state as authentication, authorization, or protection for financial or personal data. Do not present unavailable account data as real.

## UI and accessibility

- Preserve the ProcoBaja logo assets, red palette, DM Sans and JetBrains Mono. Use `lucide-react` for interface icons.
- Support widths from 320 px upward, including short viewports. Keep the mobile sidebar operable by keyboard, with focus contained while open and restored on close.
- Keep interactive controls at least 44 px high, and icon-only controls at least 44 px wide. Keep dense tables scrollable within their own region.
- Use responsive layouts; KPI grids have one column on mobile, two on tablet and four on desktop.
- Use semantic colors in `src/styles.css` and check light and dark modes, including status colors. Respect reduced-motion preferences.
- Use `rounded-md`, `rounded-lg` and `rounded-full`; reserve `rounded-2xl` for the login card. Avoid arbitrary radii and card shadows.
- Write user-facing labels in Brazilian Portuguese.

## Design reference

For visual implementation or comparison, use the [Figma design system](https://www.figma.com/design/NhEuGEDcNqW2NNMnP614YV/PROCOBAJA-ERP-%C2%B7-UI-Kit---Design-System?node-id=0-1&t=baEGJUvpkYT1JrQA-1), together with `DESIGN.md` and the actual implementation. Preserve explicit user-requested deviations from Figma.
