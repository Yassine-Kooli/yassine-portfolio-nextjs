# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint (flat config in eslint.config.mjs)
```

No test suite configured.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand · react-rnd · Resend (email)

## Architecture

**YassineOS** — the portfolio is a desktop-style workspace for a Business Intelligence Analyst & Developer. Professional tone, no gothic or novelty theming. English only. `app/page.tsx` renders `os/os.tsx`, which switches between phases (`boot` → `login` → `desktop`, plus `off`) stored in `store/system.ts`.

- `os/` — shell: boot/lock/power-off screens, `desktop.tsx` (wallpaper, top bar, dock, launcher, icons, context menu), `window.tsx` (react-rnd frame), `mobile-shell.tsx` (<768px: home-screen grid, top window shown full screen), `wallpaper.tsx` (CSS-only wallpapers: graphite, midnight, slate grid).
- `apps/` — one component per app, all taking `AppProps` (`windowId`, `props`, `active`). Current apps: About, BI Dashboard, Terminal, Files, Contact, Settings (plus Text Editor and Document Viewer, not launchable). Register new apps in `lib/apps.ts` (metadata: title, icon, size, singleton) **and** `os/app-view.tsx` (component map).
- `apps/dashboard.tsx` — BI dashboard built with plain SVG/HTML (no chart library). Uses the reference palette from the dataviz skill (`references/palette.md`, dark chart surface). Every panel has a table view. Data comes from `lib/sales-data.ts`, which is **illustrative sample data**, labelled as such in the UI.
- `store/windows.ts` — window manager: open/close/focus/minimize/maximize, z-order. `open(appId, { props })` dedupes singletons and same-`path` windows.
- `store/system.ts` — phase, wallpaper and accent settings (persisted to localStorage, versioned; bump `SETTINGS_VERSION` when the shape changes), notifications.
- `lib/fs.ts` — virtual filesystem built from `lib/data.ts` and `lib/sales-data.ts`; shared by the Terminal (`ls/cd/cat/open`) and Files app. `lib/open.ts#openPath` opens a node with the right app.
- `apps/terminal/commands.tsx` — command registry (`hidden: true` = excluded from `help`/completion).

**Content** — profile, experience (with highlights), education, projects, skills and languages in `lib/data.ts`. **The CV is the source of truth** (`Yassine_Kooli_CV_EN_Schneider_BI.docx`): keep `lib/data.ts` in sync with it, and do not add claims (metrics, freelance work, clients) that the CV does not support. CV PDF at `public/CV.pdf`.

**Accent color** — CSS var `--accent` (RGB triplet) set from settings; use Tailwind `accent` color (`text-accent`, `bg-accent/20`).

**Email** — `actions/sendEmail.ts` is a Server Action using Resend, used by `apps/mail.tsx`. Requires `RESEND_API_KEY`.

## Env vars

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Sending contact form emails |
