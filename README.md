# zainn.me

Zain Ali's site: white, every section in its own rounded frame, one typeface, almost no text on the home page. The first frame holds one glossy white knot over a soft shadow; then the work and the papers as names and numbers beside a close view of the same knot, which becomes each project's own knot as you point at it; one sentence of belief, his record, and how to reach him. Each system has a technical write-up behind its row, and one page lists everything that didn't work.

## Design

- **White, framed.** Rounded white panels (`--panel`) twelve pixels apart on a pale stone page (`--page`). Ink for what you read, grey for what explains it. Blue (`--blue`) marks the row whose knot is showing. Red (`--coral`) appears only on what said no.
- **One typeface.** Archivo, light (≈290) for anything large, regular for anything read. See `docs/type.md`.
- **Almost no text on the home page.** One sentence, three facts, each project as a name, a field and one number; everything longer lives on the write-ups.
- **Fig. 0.** `public/fig0.js` with three.js (vendored in `public/vendor/`, mapped by an import map): the ceramic. One torus knot glazed like porcelain (a physical material lit by a studio of soft boxes), over a blurred contact shadow. Each project has its own (p, q) knot — engram (2,3), loci (3,4), whetstone (2,7), spindle (3,5), reverie (5,3), CONOID (3,7); the home knot is (2,5) — and the shapes are morph targets of one mesh, so pointing at a row melts the knot into that project's knot, with a caption naming the pair. Two views — the first frame and a sticky close view beside the work — each with its own canvas, drawing only while on screen; paused in a background tab; under reduced motion it holds still and changes shape without moving.

## Stack

Next.js (App Router, static export) and React 19. The home page ships no framework JavaScript — only Fig. 0 and three.js — and the ledger none at all; case pages hydrate only Copy BibTeX.

## Run

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # next build, strip framework JS from static pages, check-once
pnpm qa       # Playwright over out/: overflow, motion, first screen, one family, the colour law, rows, counts
node scripts/og.mjs   # after a build: the social card, captured from the real hero
```

## Where things live

- `lib/content.ts` — every word and number on the site. `home` holds the copy only the home page prints (the opening sentence, each project's field, the ledger line, the contact line); systems, papers, experience, rules and the ledger hold the rest. `GEDANKEN_PUBLIC` and `PMR_PUBLIC` keep unreleased work out of the export entirely.
- `lib/facts.ts` + `scripts/check-once.ts` — every fact on the home page appears exactly once; deep links resolve; banned and held strings appear nowhere.
- `app/globals.css` — the design: tokens, the frames, header, the first frame, the work beside its close view, the belief, about, contact, write-up pages, figures, the schematic, the ledger.
- `public/fig0.js` — Fig. 0; `public/vendor/three-0.160.0.module.min.js` — three.js r160 (MIT).
- `scripts/qa.mjs` — what the design promises, checked in a real browser.
- `docs/public-assets.md` — what `public/` serves and why.
