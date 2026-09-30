# What public/ serves

Everything in `public/` is published at zainn.me/<path>, linked or not, so it holds only what a page uses.

| file | used by |
|---|---|
| `profile.webp` | home hero portrait (source 900 × 1015) |
| `conoid/page-1.webp`, `page-1-360.webp`, `page-1-660.webp` | the paper-as-object link on home and /papers/conoid |
| `conoid/preprint.pdf` | the CONOID preprint (pages 17–33 are the FYP poster and open-house deck; trimming it to pages 1–16 is pending) |
| `CNAME`, `.nojekyll` | GitHub Pages |

Media no page links to lives in `archive/` at the repo root, which is git-ignored and never exported. `scripts/check-once.ts` fails the build if any exported file outside `_next/` is not referenced by a page.
