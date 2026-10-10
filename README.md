# zainn.me

Zain Ali's site, in plain words: what he builds, his open-source projects with one result each, the paper, where he has worked and studied, and how to reach him. Each project has a technical write-up behind its card, and one page lists everything that didn't work.

## Stack

Next.js (App Router, static export) and React 19. No client JavaScript on the home page or the ledger; case pages hydrate only the results filter and Copy BibTeX. One self-hosted font, Geist (a subset, weights 400–600); Source Serif 4 stands behind it for the few Greek letters in the write-ups.

## Run

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # next build, strip JS from static pages, check-once
pnpm qa       # Playwright over out/: overflow, motion, first screen, one family, the orange dot, cards, counts
```

## Where things live

- `lib/content.ts` — every word and number on the site. Each system's `plain` card copy, the technical write-ups, papers, experience, and the ledger of what didn't work. `GEDANKEN_PUBLIC` and `PMR_PUBLIC` keep unreleased work out of the export entirely.
- `lib/facts.ts` + `scripts/check-once.ts` — every fact on the home page appears exactly once; deep links resolve; banned and held strings appear nowhere.
- `app/globals.css` — the design: tokens, hero, cards, the paper card, lists, write-up pages, figures.
- `scripts/qa.mjs` — what the design promises, checked in a real browser.
- `docs/public-assets.md` — what `public/` serves and why.
