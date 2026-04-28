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

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Three.js (@react-three/fiber) · next-themes · Resend (email)

## Architecture

Single-page portfolio. All sections render on `app/page.tsx`. No routing beyond the root.

**i18n** — custom (not next-intl runtime). Language stored in `context/language-context.tsx`. Components call `useTranslation()` → `getTranslation(key, language)` in `lib/translations.ts`, which resolves dot-notation keys against `messages/en/index.json` or `messages/fr/index.json`. Falls back to English silently.

**Active section tracking** — `context/active-section-context.tsx` tracks which nav section is in view. `useSectionInView` hook (via Intersection Observer) updates it; `timeOfLastClick` suppresses observer updates briefly after a nav click.

**Data** — all content lives in `lib/data.ts`. Experience items reference i18n keys (e.g. `"experience.currentJob.title"`); projects/skills/testimonials are inline English strings.

**Email** — `actions/sendEmail.ts` is a Next.js Server Action using Resend. Requires `RESEND_API_KEY` env var. Template in `email/contact-form-email.tsx` uses `@react-email/components`.

**Contexts** (all client-side, wrap layout):
- `ThemeContextProvider` — dark/light via next-themes
- `LanguageContextProvider` — `'en' | 'fr'`
- `ActiveSectionContextProvider` — current nav section

## Env vars

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Sending contact form emails |
