# zainn.me

Zain Ali's site: the work, each piece against the control that could have killed it, the rules he works by, the papers and the record.

## Stack

Next.js (App Router, static export) and React 19. No client JavaScript on the home page or the ledger; case pages hydrate only the results filter and Copy BibTeX. Fonts are self-hosted subsets: Newsreader in a display and a text cut, Hanken Grotesk for what is measured, Source Serif 4 behind them for arrows and Greek.

## Run

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # next build, strip JS from static pages, check-once
pnpm qa       # Playwright over out/: overflow, alignment, type budget, colour law, ledger
```

## Where things live

- `lib/content.ts` — every word and number on the site. Systems, papers, the record, the rules, the ledger of what said no. `GEDANKEN_PUBLIC` and `PMR_PUBLIC` keep unreleased work out of the export entirely.
- `lib/facts.ts` + `scripts/check-once.ts` — every fact on the home page appears exactly once; deep links resolve; banned and held strings appear nowhere.
- `app/globals.css` — the design: tokens, the seven-size type scale, the row grammar, case pages, figures.
- `scripts/qa.mjs` — what the design promises, checked in a real browser.
- `docs/public-assets.md` — what `public/` serves and why.
