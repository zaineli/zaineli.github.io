# Zain Ali — Portfolio

Personal portfolio for **Zain Ali, Product Engineer**, built in the design language of
[amanhsn.com](https://www.amanhsn.com/) (see [`amanhsn-design-spec.md`](./amanhsn-design-spec.md) for the full
reverse-engineered spec this implements).

## Stack

- **Next.js** (App Router) + **React 19**
- **Tailwind CSS v4** (CSS-first `@theme`, attribute-driven dark mode)
- **Fonts:** Satoshi (Fontshare, primary sans) · Inter (uppercase labels) · Geist Mono (numerals) · DM Mono (micro-labels) · Geist (experience rows)
- Custom inverting cursor, glass-on-scroll nav, scroll-reveal, light/dark theme toggle

## Run

```bash
pnpm install   # or npm install
pnpm dev       # http://localhost:3000
pnpm build     # production build
```

## Where to edit

- **All content** lives in [`lib/content.ts`](./lib/content.ts) — profile/bio, experience, project cards, the
  two case studies, and the playground list. Search for `[[ … ]]` and `TODO` markers for things only you can fill
  (Omni-Agent metrics, personal lines, contact address).
- **Design tokens** (colors, type scale, radii, motion) live in [`app/globals.css`](./app/globals.css).
- **Add your CV** at `public/Zain_Ali_CV.pdf` and real project images in `public/` (see `public/README.md`).

## Structure

```
app/
  layout.tsx            fonts, theme bootstrap, nav + footer shell, cursor
  page.tsx              home: hero · experience · selected work
  about/                /about
  playground/           /playground
  work/omni-agent/      case study (draft — needs your input)
  work/conoid/          case study (complete)
components/             Nav, Footer, CursorFollow, ThemeToggle, ProjectCard, CaseStudyView, …
lib/content.ts          ← edit your content here
```
