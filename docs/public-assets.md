# What public/ serves

Everything in `public/` is published at zainn.me/<path>, linked or not, so it holds only what a page uses.

| file | used by |
|---|---|
| `profile.webp` | the portrait in the home page’s About section, printed in two colours by an SVG filter (source 900 × 1015) |
| `fig0.js` | Fig. 0, the ceramic knot on the home page (the first frame and the close view beside the work) — the only script the home page ships |
| `vendor/three-0.160.0.module.min.js` | three.js r160 (MIT), imported by `fig0.js` through the home page's import map |
| `conoid/page-1.webp`, `page-1-360.webp`, `page-1-660.webp` | the first-page link on /papers/conoid |
| `conoid/preprint.pdf` | the CONOID preprint, pages 1–16 only (the FYP poster and open-house deck that followed were cut on 2026-10-10; the full file is in git history) |
| `CNAME`, `.nojekyll` | GitHub Pages |

Media no page links to lives in `archive/` at the repo root, which is git-ignored and never exported. `scripts/check-once.ts` fails the build if any exported file outside `_next/` is not referenced by a page.
