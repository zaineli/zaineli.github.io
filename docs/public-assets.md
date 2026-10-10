# What public/ serves

Everything in `public/` is published at zainn.me/<path>, linked or not, so it holds only what a page uses.

| file | used by |
|---|---|
| `profile.webp` | home hero portrait (source 900 × 1015) |
| `conoid/page-1.webp`, `page-1-360.webp`, `page-1-660.webp` | the first-page link on /papers/conoid |
| `conoid/preprint.pdf` | the CONOID preprint, pages 1–16 only (the FYP poster and open-house deck that followed were cut on 2026-10-10; the full file is in git history) |
| `CNAME`, `.nojekyll` | GitHub Pages |

Media no page links to lives in `archive/` at the repo root, which is git-ignored and never exported. `scripts/check-once.ts` fails the build if any exported file outside `_next/` is not referenced by a page.
