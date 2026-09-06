# public/

Static assets, served at the site root (e.g. `public/tvface/cover-image.png` → `/tvface/cover-image.png`).
All project media referenced by `lib/content.ts` lives here and is wired into the cards
and case studies. White-background charts/diagrams are framed with `plate: "light"` (a white
plate + inner padding) so they read cleanly on the dark theme — see `CaseFigure` in `lib/content.ts`.

## Still needed

- **`Zain_Ali_CV.pdf`** — your résumé. The nav "CV", footer "CV", and the social row all link to
  `/Zain_Ali_CV.pdf`. Until you drop it here, those links 404. (`profile.png` is already in place.)

## Safe to delete (unreferenced, large)

These aren't used by the site and only bloat the deploy:

- `conoid/Conoid Final.mov` (~419 MB) — master render; the web cut is `conoid/conoid.mp4` / `conoid-demo.mp4`.
- `conoid/Screencast From 2026-05-06 01-12-51.mp4` (~32 MB) — superseded by `conoid-demo.mp4`.

## Unused-but-kept

A few assets aren't surfaced (the deck's title/SDG slides, the TVFace green summary cards). They're
harmless to keep; pull them into a case-study `figures` array in `lib/content.ts` if you want them shown.
