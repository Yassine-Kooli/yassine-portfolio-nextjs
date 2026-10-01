# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint via next lint
```

No test suite configured.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand · react-rnd · Resend (email)

## Architecture

**YassineOS** — the portfolio is a fake GNOME-style Linux desktop with a dark black-metal theme. English only. `app/page.tsx` renders `os/os.tsx`, which switches between phases (`boot` → `login` → `desktop`, plus `off`) stored in `store/system.ts`.

- `os/` — shell: boot/lock/power-off screens, `desktop.tsx` (wallpaper, top bar, dock, launcher, icons, context menu), `window.tsx` (react-rnd frame), `mobile-shell.tsx` (<768px: home-screen grid, top window shown full screen), `wallpaper.tsx` (procedurally generated SVG wallpapers).
- `apps/` — one component per app, all taking `AppProps` (`windowId`, `props`, `active`). Register new apps in `lib/apps.ts` (metadata: title, icon, size, singleton) **and** `os/app-view.tsx` (component map).
- `store/windows.ts` — window manager: open/close/focus/minimize/maximize, z-order. `open(appId, { props })` dedupes singletons and same-`path` windows.
- `store/music.ts` + `lib/spotify.ts` — music streams through the Spotify iFrame API embed, mounted inside `apps/music.tsx` (it must stay visible per Spotify's embed terms, so closing the Music window stops playback; minimizing keeps it). The store calls the live controller; `wantPlay` queues playback until the embed is ready. No volume/visualizer — the embed doesn't expose audio.
- `store/system.ts` — phase, wallpaper/accent/effects settings (persisted to localStorage), notifications.
- `lib/fs.ts` — virtual filesystem built from `lib/data.ts` and `lib/playlist.ts`; shared by the Terminal (`ls/cd/cat/open`) and Files app. `lib/open.ts#openPath` opens a node with the right app.
- `apps/terminal/commands.tsx` — command registry (`hidden: true` = easter egg, excluded from `help`/completion).

**Content** — profile, experience, projects, skills in `lib/data.ts`. Music tracks (Spotify track IDs + cover URLs) in `lib/playlist.ts`. CV at `public/CV.pdf`.

**Accent color** — CSS var `--accent` (RGB triplet) set from settings; use Tailwind `accent` color (`text-accent`, `bg-accent/20`).

**Email** — `actions/sendEmail.ts` is a Server Action using Resend, used by `apps/mail.tsx`. Requires `RESEND_API_KEY`.

## Env vars

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Sending contact form emails |
