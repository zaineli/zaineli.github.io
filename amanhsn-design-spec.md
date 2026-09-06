# amanhsn.com — Design Language Spec

A complete, implementation-ready specification for rebuilding the portfolio of **Syed Aman Hussain** (Product Designer @ ImagineArt / Vyro.ai) in its exact aesthetic. Every hex, px, ms, easing, radius, and font name below is ground truth, verified against the compiled CSS and live markup.

---

## 1. Overview & Vibe

This is a **minimal, editorial portfolio that looks like it was designed by an engineer** — near-monochrome ink-on-paper neutrals (cool-slate-tinted blacks on pure white) with a **single blue accent** used so sparingly it reads as deliberate. The personality lives in craft details: a **custom inverting cursor** that doubles as a contextual microcopy layer, **monospaced numerals** for years and metrics, a **lowercase developer-handle wordmark** paired with an asterisk ornament, and a sticky nav that **frosts into glass** on scroll. Motion is quiet and expensive-feeling — nothing scales more than ~5%, everything settles on a single luxurious `cubic-bezier(.32,.72,0,1)` curve over sub-200ms. The voice matches the look: sober, metric-led case studies in one register; warm, internet-native slang quarantined to personal pages — a designer who sits at the intersection of engineering, AI, and pure design, and writes like it.

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | **Next.js** (App Router) |
| Styling | **Tailwind CSS v4** (v4.3.0 compiled output; `@theme` + `@layer components`) |
| Fonts | **next/font** self-hosted woff2 (Geist, Geist Mono, DM Mono, Inter) + **Satoshi** via Fontshare `<link>` |
| Images | **next/image** (`fill` + `object-cover`) |
| Hosting / analytics | **Vercel** + Vercel Analytics & Speed Insights |
| Theming | CSS custom properties; `:root` (light, default) / `[data-theme=dark]`; persisted in `localStorage` (key `theme`, default `"system"`) with inline no-FOUC bootstrap respecting `prefers-color-scheme` |
| Route transitions | View Transitions API wired up but **intentionally disabled** (`::view-transition { animation: none }`) for instant route changes |

**Document head:** title `Aman's Portfolio`; meta description *"Product designer bridging engineering, AI, and pure design. Currently at ImagineArt (Vyro.ai)."* `preconnect` to `api.fontshare.com` + `cdn.fontshare.com`.

**Routes:** `/` (single-page scrolling home, anchored `#work`), `/about`, `/playground`, and six case studies: `/work/film-studio`, `/work/upscale`, `/work/assist`, `/work/power-zone`, `/work/clinio`, `/work/share-ease`.

---

## 3. Typography

### 3.1 The five families and their real roles

> **Critical correction to common assumptions:** the *primary* sans is **Satoshi** (loaded from Fontshare), not Geist. The Tailwind theme sets `--font-sans: "Satoshi", ui-sans-serif, system-ui, -apple-system, sans-serif`, so every class reading `var(--font-sans)`/`font-sans` (nav, wordmark, hero role/body, project titles & body, meta table, `.t-h2`, `.t-subhead`, `.t-body`) renders in **Satoshi**. The four next/font families are invoked **narrowly and explicitly** via their own CSS variables. Inter is NOT a fallback — it is an active, load-bearing label voice.

| Variable | Family | Loading | Weights | Role |
|---|---|---|---|---|
| `--font-sans` | **Satoshi** | Fontshare `<link>` | 400, 500, 700 (discrete) | Primary display + UI + body — the workhorse. 700 is the single emphasis weight. |
| `--font-inter` | **Inter** | next/font woff2 | 400, 500 (discrete) | The "engineered label / identity" voice — uppercase + tracked: hero **name**, **eyebrows**, **footer links**, inline links. |
| `--font-geist-mono` | **Geist Mono** | next/font woff2 | variable 100–900 (only 400 used) | Numerals / timeline **years** — data/engineering register. |
| `--font-dm-mono` | **DM Mono** | next/font woff2 | 400, 500 (discrete) | The 10px uppercase micro-label (`.t-mono-xs`) — typewriter-ish annotation stamp (subpages). |
| `--font-geist` | **Geist** (proportional) | next/font woff2 | variable 100–900 (only 400 used) | Deliberate accent — only the experience-row **company** & **role**, giving the timeline a different texture from Satoshi cards. |

Mental model: **3-voice contrast** — humanist sans (Satoshi) for narrative, grotesk uppercase (Inter) for labels/identity, monospace (Geist Mono / DM Mono) for data & micro-annotation.

**Loading details:** all four next/font faces ship with `font-display: swap` and a `local("Arial")` metric-matched `-Fallback` family (`ascent`/`descent`/`size-adjust` overrides to prevent CLS). Satoshi is the only external dependency. `<html>` carries all four next/font variable classes (`__variable_3eb911` Inter, `__variable_246ccd` Geist, `__variable_4c40f6` Geist Mono, `__variable_9ef920` DM Mono).

Fallback metric overrides (for parity):

| Family | ascent | descent | size-adjust |
|---|---|---|---|
| Geist | 95.94% | 28.16% | 104.76% |
| Geist Mono | 74.67% | 21.92% | 134.59% |
| DM Mono | 73.71% | 23.03% | 134.59% |
| Inter | 90.44% | 22.52% | 107.12% |

**Numerals:** there is **no** `font-variant-numeric` / `tabular-nums` / `slashed-zero` anywhere. Tabular alignment of years & metrics is achieved **structurally** by setting numeric content in a mono face (Geist Mono / DM Mono), whose glyphs are inherently fixed-width. Replicate it the same way — reach for a mono face, not a CSS numeric feature.

### 3.2 Named type scale (verbatim from `@layer components`)

px values shown as `mobile → desktop` where the markup applies a responsive override. "LS" = letter-spacing. All sizes/line-heights are **hardcoded px** (the fractional values like 15.1 / 15.8 / 13.5 / 20.25 / 22.5 / 28.8 / 25.6 are Figma-exported literals — reproduce as exact px, not rem/clamp).

| Role | Class | Font | px (m→d) | Weight | Line-height | LS | Case | Color token |
|---|---|---|---|---|---|---|---|---|
| Hero name / eyebrow display | `.t-hero-name` | Inter | 17 → 20 | 400 | 24px | 2.2 → 2.8px | uppercase | `--text-name` |
| Hero role (lede) | `.t-hero-role` | Satoshi | 15 → 18 | 700 | 24 → 28.8px | — | none | `--text-strong` |
| Hero body (intro ¶) | `.t-hero-body` | Satoshi | 15 → 20 | 400 | ~24px (normal) | — | none | `--text-body` |
| Nav wordmark | `.t-nav-wordmark` | Satoshi | 20 | 700 | 24px | −0.2px | none | `--text-primary` |
| Nav link | `.t-nav-link` | Satoshi | 14 | 500 | 20.25px | — | none | `text-fg-muted` |
| Section heading H2 | `.t-h2` | Satoshi | 20 | 700 | 24px | −0.2px | none | inherit |
| Subhead / H3 | `.t-subhead` | Satoshi | 18 | 700 | 28.8px | −0.2px | none | inherit |
| Body | `.t-body` | Satoshi | 16 | 400 | 25.6px (1.6) | — | none | inherit |
| Project title | `.t-project-name` | Satoshi | 15 → 16 | 700 | normal | — | none | `--text-primary` |
| Project body | `.t-project-body` | Satoshi | 14 → 15.1 | 400 | 20 → 20.25px | 0.473px | none | `--text-primary` |
| Meta table label | `.t-table-label` | Satoshi | 13.5 → 15.8 | 400 | 20 → 20.25px | 0.473px | none | `--text-secondary` |
| Meta table value | `.t-table-value` | Satoshi | 14 → 16 | 500 | 20 → 20.25px | 0.473px | none | `--text-primary` |
| Experience year (mono) | `.t-exp-year` | **Geist Mono** | 13 → 15 | 400 | 22.5px | — | uppercase | `--text-tertiary` |
| Experience company | `.t-exp-company` | **Geist** | 14 → 15 | 400 | 22.5px | — | none | `--text-company` |
| Experience role | `.t-exp-role` | **Geist** | 13 → 15 | 400 | 22.5px | — | none | `--text-tertiary` |
| Meta / button label | `.t-meta` | Satoshi | 14 | 500 | 20.25px | — | none | inherit |
| Eyebrow (uppercase) | `.t-eyebrow` | **Inter** | 14 | 500 | 14px | 0.47px | uppercase | inherit |
| Micro mono label | `.t-mono-xs` | **DM Mono** | 10 | 500 | 12px | 2.8px | uppercase | inherit |
| Inline link | `.t-link` | **Inter** | 14 | 500 | 14px | — | none | inherit |
| Footer link | `.t-footer-link` | **Inter** | 14 | 500 | 14px | — | uppercase | `--text-primary` |
| Footer body | `.t-footer-body` | Satoshi | 14 | 400 | 20.25px | — | none | `--text-primary` |

**Full px scale observed:** 36, 34, 32, 30, 28, 26, 24, 20, 18, 17, 16, 15.8, 15.1, 15, 14, 13.5, 13, 12, 11, 10.

**Display tier (case-study / subpage heroes):** the home page **tops out at 20px** (hero name + wordmark). All 24–36px sizes live on case-study heroes and section headers, applied as raw Satoshi utilities — `text-[30px]`/`[28px]`/`[26px]`/`[24px]` paired with tight tracks `tracking-[-0.4px]` / `tracking-[-0.2px]` and tight leadings `leading-[1.1]` / `[1.25]` / `[1.3]`. Tailwind tokens present: `--text-base: 1rem` / lh `calc(1.5/1)`; `--text-lg: 1.125rem` / lh `calc(1.75/1.125)`; `--text-3xl: 1.875rem` / lh `calc(2.25/1.875)`.

### 3.3 Tracking (letter-spacing) — the signature lever

- **Wide positive on uppercase "engineered" labels, scaling inversely with size:** `2.8px` @ 20px hero name & @ 10px micro-label; `2.2px` @ 17px mobile name; `0.47`/`0.473px` @ 14–16px eyebrows / project body / meta table. Larger uppercase mono runs on subpages use a `tracking-[…]` ladder: `0.08em`, `0.18em`, `0.2em`, `0.22em`.
- **Tight negative on proportional Satoshi display/UI:** `−0.2px` on wordmark, H2, subhead; `−0.4px` on the largest case-study headings. (`--tracking-tight: -0.025em` present.)
- **Neutral (0) on body copy.**

Intent: uppercase + wide tracking = "label / metadata / system-speak"; negative tracking on big Satoshi keeps display optically tight and contemporary.

### 3.4 Weight system

Discrete and restrained. Tokens: `--font-weight-normal:400`, `medium:500`, `semibold:600` (defined but effectively unused), `bold:700`.

- **400** — body, hero body, hero name (Inter), experience rows, footer body.
- **500 (medium)** — the "interactive / label" weight: nav links, eyebrows, meta/button text, table values, micro-label, inline links.
- **700 (bold)** — display/emphasis: wordmark, H2, subhead, hero role, project titles.

The jump straight from 500 → 700 (skipping 600) gives headings a decisive, high-contrast voice.

---

## 4. Color System

### 4.1 Architecture

A **semantic, dual-theme token system** on CSS custom properties — no raw hex in components. Themes swap via a single attribute on `<html>`: `:root` = light (default), `[data-theme=dark]` = dark. `color-scheme: light/dark` is set per block so native controls/scrollbars match. **No gradients anywhere** — the look is flat fills + 1px borders + one soft shadow.

A Tailwind `@theme` alias family points at the semantic ramp — define the ramp once and alias, do not author two palettes:

| Tailwind alias | Resolves to |
|---|---|
| `--color-fg` | `var(--text-primary)` |
| `--color-fg-muted` | `var(--text-secondary)` |
| `--color-fg-subtle` | `var(--text-tertiary)` |
| `--color-black` | `#000` (only inside `black/…` mixes) |
| `--color-white` | `#fff` (only inside `white/…` mixes) |

A few utilities reference tokens **not defined** in the stylesheet (`--border`, `--divider`, `--card-border`, `--fg`, `--fg-subtle`). When rebuilding, **define them explicitly as aliases** so focus rings/dividers don't fall back to `currentColor`: `--border`→`--border-default`, `--divider`→`--border-subtle`, `--card-border`→`--border-default`, `--fg`→`--text-primary`, `--fg-subtle`→`--text-tertiary`.

### 4.2 Token table (exact hex, both themes)

> 8-digit hex is alpha: `#000000db` = black @ `0xdb`/255 ≈ **86%**; `#ffffffeb` = white @ ≈ **92%**. Dark neutrals are deliberately **white-with-alpha**, not solid grey (see §4.4).

**Backgrounds**
| Token | Role | Light | Dark |
|---|---|---|---|
| `--bg` | Page canvas / default surface | `#ffffff` | `#0a0a0b` |
| `--bg-elevated` | Cards, sheets, popovers | `#ffffff` (flat — relies on border/shadow) | `#131316` |
| `--bg-muted` | Recessed fills (insets, wells) | `#fafafa` | `#1a1a1d` |

**Text**
| Token | Role | Light | Dark |
|---|---|---|---|
| `--text-primary` | Highest-emphasis text/icons, cursor fill, selection bg | `#000000db` (~86%) | `#ffffffeb` (~92%) |
| `--text-secondary` | Secondary text, table labels | `#121212bf` (~75%) | `#ffffffb8` (~72%) |
| `--text-tertiary` | Muted/meta: years, roles, idle nav | `#32404f94` (~58% slate) | `#ffffff80` (50%) |
| `--text-quaternary` | Faintest (placeholders/disabled) | `#32404f59` (~35% slate) | `#ffffff52` (~32%) |
| `--text-strong` | Hero role / emphasized body | `#121212cc` (~80%) | `#ffffffd9` (~85%) |
| `--text-body` | Long-form paragraph copy | `#121212` (solid) | `#ededed` |
| `--text-company` | Experience company names | `#32404f` (slate, solid) | `#e2e6eb` |
| `--text-name` | Hero name lockup | `#121221` (near-black, faint blue cast) | `#f4f4f6` |

**Borders**
| Token | Role | Light | Dark |
|---|---|---|---|
| `--border-subtle` | Hairline dividers, hero/section rules | `#32404f26` (slate ~15%) | `#ffffff14` (~8%) |
| `--border-default` | Default card/input/pill borders | `#d9d9de` | `#ffffff24` (~14%) |
| `--border-strong` | Emphasized/hover borders, slider track | `#d4d4d4` | `#ffffff38` (~22%) |
| `--border-row` | Meta-table row top borders | `#d4d4d4` | `#ffffff24` (~14%) |

**Accent**
| Token | Role | Light | Dark |
|---|---|---|---|
| `--accent` | Single brand/interactive accent (links, focus) | `#0080ff` | `#39f` (= `#3399ff`) |
| `--accent-fg` | Foreground on an accent fill | `#fff` | `#0a0a0b` (= dark `--bg`) |

> **Correction:** `#39f` is the *dark-theme accent*, **not** a light-theme hover. There is no `--accent` hover override; hover is expressed via background/opacity tokens (`--pill-bg-active`, `hover:opacity-70`).

**Metric accents (reserved — quantitative deltas only)**
| Token | Role | Light | Dark |
|---|---|---|---|
| `--text-accent-green` | Positive / "up" metric | `#0a9d4a` | `#4ade80` |
| `--text-accent-red` | Negative / "down" metric | `#ff0004` | `#ff5a5e` |

**Pills / tags**
| Token | Role | Light | Dark |
|---|---|---|---|
| `--pill-bg` | Pill resting fill | `var(--bg)` | `var(--bg)` |
| `--pill-border` | Pill border | `var(--border-default)` | `var(--border-default)` |
| `--pill-bg-active` | Active/hover nav pill + segmented-control fill | `#f3f3f4` | `#ffffff0f` (~6%) |
| `--tag-bg` | Scope-tag / eyebrow chip / icon-button fill | `#f6f6f7` | `#ffffff0a` (~4%) |

**Cursor + shadows**
| Token | Role | Light | Dark |
|---|---|---|---|
| `--cursor-bg` | Custom-cursor fill | `var(--text-primary)` (black) | `#fff` |
| `--cursor-fg` | Text/icon inside cursor | `var(--bg)` (white) | `#0a0a0b` |
| `--cursor-shadow` | Cursor drop shadow | `0 2px 12px #0000002e` (~18%) | `0 2px 12px #00000080` (50%) |
| `--shadow-card` | The only card elevation shadow | `0 4px 15px #0000001a` (~10%) | `0 4px 20px #00000073` (~45%) |

**Selection** echoes the cursor inversion: `::selection { background: var(--text-primary); color: var(--bg) }`.

### 4.3 Intent notes

- **Near-monochrome, slate-tinted.** Blacks are cooled toward slate (`#32404f`, `#121221`); off-whites are pure (`#fff`, `#fafafa`). Gives the light theme an ink-on-paper, editorial/engineering restraint rather than flat grey.
- **One accent, used sparingly.** A single blue is the only chromatic hue in the interactive system — so it always reads as deliberate.
- **Green/red quarantined to metrics.** Never general UI state. Color stays semantically meaningful: blue = interactive, green/red = quantitative direction, everything else = neutral.
- **Elevation = border + soft shadow (light); tint ramp + heavier shadow (dark).** Light cards separate from canvas via `--border-default` + a soft `--shadow-card` (both `--bg`/`--bg-elevated` are `#fff`). Dark rebuilds elevation as a stepped tint ramp `#0a0a0b → #131316 → #1a1a1d`.

### 4.4 Dark-mode alpha technique (copy this faithfully)

Dark mode rebuilds the **entire border + tag/pill + text ramp as white-with-alpha**, stepping opacity for hierarchy:

- Borders: `--border-subtle` `#ffffff14` (~8%) → `--border-default`/`--border-row` `#ffffff24` (~14%) → `--border-strong` `#ffffff38` (~22%).
- Fills: `--tag-bg` `#ffffff0a` (~4%) → `--pill-bg-active` `#ffffff0f` (~6%).
- Text: `#ffffffeb`/`b8`/`80`/`52` (92/72/50/32%).

Why: translucent white inherits whatever surface sits behind it, so one token reads correctly on `--bg`, `--bg-elevated`, and `--bg-muted` without per-surface variants. Hierarchy is encoded as **opacity steps**, not distinct greys.

### 4.5 One-off / non-system colors

- **Overlays:** modal/lightbox scrims `bg-black/20` (`#0003`), `bg-black/60` (`#0009`).
- **Glass nav:** `bg-[color-mix(in_oklab,var(--bg)_92%,transparent)]`, also `bg-[var(--bg)]/85`, `bg-[var(--bg-elevated)]/95`.
- **Border alpha mixes:** `border-black/[.08]` (`#00000014`), `border-white/15`, `border-white/20`, `dark:border-white/[.145]`.
- **Media caption whites:** `text-white/40,45,55,65,70,80`.
- **Decorative literals (not tokens):** `#0c0d10`, `#fafaf6` (device-frame chrome); `#383838` (one dark button hover fill).
- **Tailwind zinc (oklch), barely used:** `zinc-50 oklch(98.5% 0 0)`, `zinc-400 oklch(70.5% .015 286.067)`, `zinc-600 oklch(44.2% .017 285.786)`, `zinc-950 oklch(14.1% .005 285.823)` — likely skeleton/loader; not core.

---

## 5. Spacing, Layout & Grid

### 5.1 Spacing base

Tailwind v4 default: `--spacing: .25rem` (**4px**); numeric utilities = `calc(var(--spacing) * n)`. The design **heavily bypasses the scale with arbitrary px bracket values** (`gap-[64px]`, `pt-[32px]`, `md:gap-[44px]`, `lg:px-[104.5px]`) — these are the load-bearing rhythm numbers.

### 5.2 The page spine (vertical rhythm)

`<main>` is a centered vertical flex column owning all macro spacing — the **64 → 96px responsive jump** is the signature rhythm:

```
<main class="flex w-full flex-col items-center
   gap-[64px] pb-[64px] pt-[32px]
   md:gap-[96px] md:pb-[96px] md:pt-[64px]">
```

| | Mobile | Desktop (`md`) |
|---|---|---|
| Inter-section gap | 64px | 96px |
| Top padding (below nav) | 32px | 64px |
| Bottom padding (above footer) | 64px | 96px |

**Micro spacing (observed):** `gap-[2px]` (hero role line stack), `gap-[3/4/6/8px]` (nav pill internal = `gap-[6px]`, small clusters), `gap-2`/`gap-[8px]` (hero heading block, blurb paragraphs), `gap-3` (12px nav link group), `gap-[16px]` (work-section wrapper, project text column), `gap-8 → md:gap-[44px]` (project card text↔image), `gap-6` (footer columns), `gap-x-6 gap-y-2` → `md:gap-x-[32px]` (footer links).

### 5.3 Containers / rails

Two deliberately different content rails, both `mx-auto`:

| Rail | max-width | Applied to |
|---|---|---|
| **Wide rail** | `max-w-[1441px]` | Sticky nav inner, footer inner, decorative asterisks |
| **Content rail** | `max-w-[1280px]` | Hero text, timeline, social row, project cards |

Nav/footer extend ~80px wider than content on each side. Other max-widths in the system (subpages/prose/modals): `420/520/640/680/760/800/820/900/1000/1200px`, plus `max-w-prose` (65ch), `max-w-3xl` (768px), `max-w-md`, `max-w-xs`, `max-w-[min(75vmin,560px)]` for square media. Cap long-form copy at ~640–760px.

### 5.4 Horizontal gutter ladder

| Element | base | `sm` (≥640) | `md` (≥768) | `lg` (≥1024) |
|---|---|---|---|---|
| Work / hero section | `px-5` (20) | `px-8` (32) | — | `px-[80px]` |
| Project-card section | `px-5` (20) | `px-8` (32) | — | `px-0` (card fills content column edge-to-edge) |
| Nav header | `px-5` (20) | `px-8` (32) | — | `px-[52px]` |
| Footer | `px-5` (20) | `px-8` (32) | `px-[80px]` | `px-[104.5px]` |

### 5.5 Radii

Tokens (`@layer theme`):

| Token | Value (px) |
|---|---|
| `--radius-sm` | 8 |
| `--radius-md` | 12 |
| `--radius-lg` | 16 |
| `--radius-xl` | .75rem (12) |
| `--radius-2xl` | 1rem (16) |
| `--radius-pill` | 999px |

Raw arbitrary radii also in use: `10px`, `14px`, `16px`, `18px`, `20px`, `1.4rem` (22.4), `1.75rem` (28), `rounded` (4), `rounded-t-[2px]`.

**Component mapping** (radius grows with element size; all interactive controls are full pills):

| Component | Radius |
|---|---|
| Nav pills, Get-in-Touch button, theme toggle, hamburger, "+27" tag chip | `--radius-pill` = 999px |
| Social icon buttons (LinkedIn/Behance/CV/Spotify) | `--radius-sm` = 8px |
| Project case-study image card | 16px |
| Gallery / mid cards | 1.4rem (22.4), 18, 20, 14, 10px |
| Big playground feature cards | 1.75rem (28px) |

### 5.6 Elevation

Exactly **one** card shadow token, theme-aware (depth otherwise comes from 1px borders):

| Theme | `--shadow-card` |
|---|---|
| Light | `0 4px 15px #0000001a` (~10%) |
| Dark | `0 4px 20px #00000073` (~45%) |

Applied inline (`style="box-shadow:var(--shadow-card)"`) on project image cards. Utility-pool extras used sparingly for modals: `.shadow`, `.shadow-2xl` (`0 25px 50px -12px #00000040`); plus `--cursor-shadow` (§4.2).

### 5.7 Card anatomy — the centerpiece project card

Each of 6 projects is a `<section>` with a **two-column flex** that alternates side (zig-zag) via `md:flex-row` / `md:flex-row-reverse`; mobile stacks (text above image).

```
<div class="flex … gap-8 md:flex-row md:items-center md:gap-[44px] [md:flex-row-reverse]">
  <!-- TEXT COLUMN: md:w-[397px] md:h-[597px] md:pr-[18px] -->
    h2 .t-project-name (16px/700) · 2× .t-project-body (15.1px), gap-[8px]
    META TABLE (pt-[16px]): rows Year / Role / Scope / Device / Tools / Link
  <!-- IMAGE CARD: md:w-[839px] -->
    <a href="/work/…"><div class="aspect-[839/597] rounded-[16px]
        border border-[var(--border-default)] md:h-[597px]"
        style="box-shadow:var(--shadow-card)">
      <img class="object-cover" fill /></div></a>
</div>
```

- **Text column:** fixed `md:w-[397px]`, `md:h-[597px]`, `md:pr-[18px]`.
- **Image card:** `md:w-[839px]`, `md:h-[597px]`, `aspect-[839/597]` (≈1.405:1), `rounded-[16px]`, 1px `--border-default`, `--shadow-card`, Next `fill` + `object-cover`.
- **Column gap:** 32px → 44px (`md:gap-[44px]`).

**Meta table sub-system** — flex rows, fixed-width label + flexing value, each with a top border:

| Property | Mobile | `sm` |
|---|---|---|
| Label col width | `w-[72px]` shrink-0 | `w-[75.94px]` |
| Value col | `flex-1` | `flex-1` |
| Row padding | `pt-[12px] pb-[12px]` | `pt-[15.247px] pb-[16.5px]` |
| H-padding | `px-px` (1px) | same |
| Separator | `border-t 1px var(--border-row)` | same |

(The precise `15.247px`/`75.94px` betray a Figma px→rem export pipeline.)

### 5.8 Experience timeline (grid list)

A tight CSS Grid, 2-col on mobile → 3-col on `sm`, reordering the role via `col-start`/`row-start`:

```
<div class="grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-x-3 gap-y-0
   sm:grid-cols-[104px_224px_minmax(0,1fr)] sm:gap-x-[8px]">
  .t-exp-year (row-start-1) · .t-exp-company (row-start-1, truncate) ·
  .t-exp-role (col-start-2 row-start-2 → sm:col-start-3 sm:row-start-1, truncate)
</div>
```

| | Mobile | `sm` |
|---|---|---|
| Template | `[64px minmax(0,1fr)]` | `[104px 224px minmax(0,1fr)]` |
| Column gap | `gap-x-3` (12px) | `gap-x-[8px]` |
| Role placement | wraps to row 2 under company | joins row 1 in col 3 |
| Row-to-row gap | `gap-[6px]` | `gap-[2px]` |

`items-baseline` aligns the mixed type sizes. Fixed mono year column (64→104px) keeps the ledger aligned.

**Social row** (below timeline): `relative h-[64px]` with an absolutely-positioned top rule (`border-top:1px solid var(--border-subtle)`) and a left-aligned icon strip `absolute left-0 top-[16px] h-[32px] gap-[16px]` (→ `sm:left-[12px]`); each icon a `h-[32px] w-[32px] rounded-[var(--radius-sm)]` (8px) tap target.

### 5.9 Sticky glass nav

```
<header class="sticky top-0 z-50 border-b border-transparent bg-transparent
   transition-[background-color,border-color,backdrop-filter] duration-200">
  <div class="mx-auto flex h-16 w-full max-w-[1441px] items-center justify-between
     px-5 sm:px-8 md:h-20 lg:px-[52px]">
```

| Property | Value |
|---|---|
| Position / layer | `sticky top-0`, `z-50` |
| Height | `h-16` (64) → `md:h-20` (80) |
| Inner rail | `max-w-[1441px]`, `mx-auto` |
| Gutters | `px-5` → `sm:px-8` → `lg:px-[52px]` |
| Initial state | transparent bg + transparent border (no glass at top) |
| Scrolled state | `bg-[var(--bg)]/85` or `color-mix(in oklab,var(--bg) 92%,transparent)` + `--border-subtle` hairline + backdrop blur |
| Transition | only `background-color,border-color,backdrop-filter`, `duration-200` |
| Entrance | inline `opacity:0; transform:translateY(-40px)` → drops in on load |

**Nav pills:** `inline-flex h-7` (28px) `gap-[6px] rounded-[var(--radius-pill)] border border-transparent px-[10px]`, transition `duration-[180ms] ease-[cubic-bezier(0.32,0.72,0,1)]`; active/hover = `--pill-bg-active` fill + `--border-default` border. **Get-in-Touch:** `h-8` (32) `rounded-pill border px-2.5` (10px). **Theme toggle / hamburger:** `h-8 w-8` square-pill icon buttons. Mobile (`md:hidden`) collapses to hamburger; desktop nav `hidden md:flex`. Two decorative asterisk PNGs flank the layout.

### 5.10 Footer

```
<div class="mx-auto flex w-full max-w-[1441px] flex-col items-start gap-6
   border-t border-[var(--border-subtle)] px-5 py-10
   sm:px-8 md:flex-row md:items-end md:justify-between md:gap-6
   md:px-[80px] md:py-[64px] lg:px-[104.5px]">
```

| | Mobile | `md` |
|---|---|---|
| Layout | `flex-col items-start` | `flex-row items-end justify-between` |
| Top border | `border-t 1px var(--border-subtle)` | same |
| V-padding | `py-10` (40) | `py-[64px]` |
| H-padding | `px-5` → `sm:px-8` | `px-[80px]` → `lg:px-[104.5px]` |
| Gap | `gap-6` (24) | `gap-6` |
| Links row | `flex-wrap gap-x-6 gap-y-2` | `gap-x-[32px]` |

Credit (`.t-footer-body`, 14px) sits left, links (`.t-footer-link`, 14px uppercase Inter, `hover:opacity-70`) right, baseline-aligned.

### 5.11 Breakpoints (Tailwind v4 defaults; three active tiers)

| Prefix | min-width |
|---|---|
| `sm` | 40rem (640px) |
| `md` | 48rem (768px) |
| `lg` | 64rem (1024px) |

Behavior: gutters step `20 → 32 → 52/80/104.5px`; section rhythm jumps `64 → 96` at `md`; project cards stack below `md` then alternate 2-col (397/839px) at `md`; experience rows 2-col → 3-col at `sm`; nav hamburger below `md`; footer stacks below `md`. Decorative asterisks: `387×387` PNGs at `-80px` offsets, `hidden … sm:block`, `opacity-90` light / `dark:opacity-15`, sized `w-[260px] md:w-[320px] lg:w-[387px]`.

---

## 6. Motion & Interaction

### 6.1 The custom inverting cursor (the signature)

Hides the native cursor and renders a follower that **inverts against the background** (black dot on white, white dot on dark) and doubles as a **microcopy layer**. **Opt-in via a root attribute**, not a blanket `cursor:none` — a `CursorFollow` component sets `data-cursor-active="true"` on `<html>` after mount:

```css
html[data-cursor-active=true] *,
html[data-cursor-active=true] :after,
html[data-cursor-active=true] :before { cursor: none !important; }
html[data-cursor-active=true] :where(input,textarea,select,[contenteditable=true]) { cursor: text !important; }
html[data-cursor-active=true] [data-cursor-native],
html[data-cursor-active=true] [data-cursor-native] * { cursor: crosshair !important; }
@media (pointer:coarse),(prefers-reduced-motion:reduce){
  html[data-cursor-active=true] *,
  html[data-cursor-active=true] :after,
  html[data-cursor-active=true] :before { cursor: revert !important; }
}
```

Progressive enhancement: if JS fails, or on touch / reduced-motion, the native cursor is never removed. Tokens (`--cursor-bg`/`--cursor-fg`/`--cursor-shadow`, §4.2) invert per theme so the dot is always legible.

**The `data-cursor` API** (follower reads attributes off the hovered element):

| Attribute | Behavior | Examples on home |
|---|---|---|
| `data-cursor="pointer"` | Dot enlarges to "clickable" state | logo, nav pills, hamburger |
| `data-cursor-text="…"` | Dot expands to a labeled pill | "View case study", "Book a call", "Dark mode", "LinkedIn", "Behance", "Spotify", "CV", per-project titles |
| `data-cursor-keep="true"` | Holds the label across nested hovers | the 6 case-study card links (label persists meta→image) |
| `data-cursor-native` | Forces `crosshair` under the dot | Playground canvas/doodle zones |

Implementation: a fixed, `pointer-events-none`, `z-[9999]` element following `mousemove` with lerp/spring + `will-change:transform`; mount-gate behind `matchMedia('(pointer:coarse)')` / `(prefers-reduced-motion: reduce)`; on `mouseover` walk up to the nearest `data-cursor*` element and switch modes.

### 6.2 Easing & duration system

One hero curve defines the brand feel; Tailwind's two stock curves do generic work.

| Token | Value | Role |
|---|---|---|
| **signature** | `cubic-bezier(.32,.72,0,1)` | The Vaul / Emil-Kowalski "smooth" ease — fast start, long settle. Used on nav pills; makes interactions feel expensive. |
| `--ease-out` | `cubic-bezier(0,0,.2,1)` | Entrances, image zooms. |
| `--ease-in-out` | `cubic-bezier(.4,0,.2,1)` | Tailwind default; generic color/bg transitions. |

**Duration ladder:**

| Duration | Where | Intent |
|---|---|---|
| `.12s` | Playground slider thumb (`transition:transform .12s`) | Direct-manipulation = instant. |
| `.15s` | `--default-transition-duration`; all bare hover color/bg | House default. |
| `.18s` (`duration-[180ms]`) | Nav pills (+ signature curve) | Readable pill fill-in. |
| `.2s` (`duration-200`) | Glass-nav state change | Smooth frost on scroll. |
| `.3s` | Larger color/opacity shifts | — |
| `.5s` (`duration-500`) | Card image zoom | Cinematic scale. |

Rule of thumb: color/border = `.15s` default ease; pills & premium UI = `.18s` signature curve; image scale = `.5s ease-out`; sliders/drag = `.12s`.

### 6.3 Glass nav state change

Transparent + borderless over the hero, then frosts on scroll: JS toggles to `bg-[var(--bg)]/85` (or `color-mix(in oklab,var(--bg) 92%,transparent)`) + `border-[var(--border-subtle)]` hairline + backdrop blur, transitioning **only** `background-color,border-color,backdrop-filter` at `.2s` (cheap, jank-free). Backdrop-blur ladder: `backdrop-blur-[4px]` (4 — light scrim) · `backdrop-blur` (8 — standard nav) · `backdrop-blur-md` (12, `--blur-md` — modals).

### 6.4 Hover micro-interactions (nothing moves >~5%)

| Element | Effect | Values |
|---|---|---|
| Case-study card image | Slow zoom | `group-hover:scale-[1.03]` (also `1.05`), wrapper `overflow-hidden`, `duration-500 ease-out`; card `transition-shadow` |
| Nav pills | Text brightens, fill+border fade in; **group spotlight** | base `text-fg-muted border-transparent` → hover `!text-fg !border-[var(--border-default)] !bg-[var(--pill-bg-active)]`; `transition-[color,background-color,border-color] duration-[180ms] ease-[cubic-bezier(.32,.72,0,1)]`. `group/nav`: hovering the nav dims all pills to `text-fg-subtle`, lights the hovered one to `text-fg`. |
| Get-in-Touch / theme toggle | Fill on hover | `hover:bg-[var(--pill-bg-active)]` + `hover:text-fg`, `transition-colors` (.15s) |
| Social / footer links | Color lift / opacity dim | `text-fg-muted hover:text-fg`; footer `hover:opacity-70` |
| Arrow / "next case study" | Arrow nudges + underlines | `group-hover:translate-x-1` (+4px) + `group-hover:underline` |
| Playground slider thumb | Grows on hover | `scale(1.15)` over `.12s`; thumb 15×15px, `border-radius:999px`, 2px border in `--bg-elevated`; track 4px in `--border-strong` |
| Generic thumb | `hover:scale-105` available | 5% |

**Focus (keyboard):** `focus-visible:ring-2 ring-[var(--fg)] ring-offset-2 ring-offset-[var(--bg)]` — clean offset halo. **Disabled:** `disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed`. Transitions name explicit properties (never `transition-all`).

### 6.5 Scroll-reveal entrances

Every major block ships SSR with inline `opacity:0` + a small `translateY`, then an intersection observer animates to rest (compositor-only, no layout shift):

| Initial inline style | Count | Applied to |
|---|---|---|
| `opacity:0; transform:translateY(-40px)` | 1 | Header (drops down on load) |
| `opacity:0; transform:translateY(12px)` | 3 | Hero text, timeline, social row |
| `opacity:0; transform:translateY(16px)` | 6 | The six project sections |

Tiny distances (12–16px) read as "settling into place." Animate to `opacity:1; translateY(0)` with `ease-out` over ~.3–.5s, slight per-section stagger. Playground cards reuse `translateY(8px)`.

### 6.6 Playground "canvas" model & route transitions

Playground signals "experimental surface": a segmented pill control ("Projects" / "Doodle") with an animated sliding active-fill (`!bg-[var(--pill-bg-active)]`), content swapping client-side via fade-and-rise (`opacity:0→1`, `translateY(8px)→0`); `data-cursor-native` zones flip the follower to **crosshair** (the only place this happens). Route changes: View Transitions wired up but **disabled** (`::view-transition { animation: none; mix-blend-mode: normal }`) → instant, clean. External links (Resume, Get-in-Touch→Calendly) carry a `lucide arrow-up-right` at `stroke-width:1.75`.

### 6.7 The overall "feel"

Calm, precise, "designed by an engineer." Mostly whitespace and monospaced labels; the inverting cursor with contextual word-pills makes the surface feel aware; hovers are subtle (≤5%, color lifts at .15–.18s on the luxurious `cubic-bezier(.32,.72,0,1)`); the nav frosts into glass; sections rise gently into view; the Playground crosshair winks at the experimental side. Accessibility respected throughout (touch/reduced-motion get the native cursor; keyboard gets offset focus rings).

---

## 7. Content & Voice

### 7.1 Brand personality — 6 adjectives

| Adjective | Evidence |
|---|---|
| **Confident / declarative** | "Most AI video tools are clip generators dressed up as filmmakers." · "Vocabulary is product." · "Design the shell, not the model." |
| **Metric-driven / receipts-first** | "Roughly 849K upscales run, peaking at 107K in a single month." · "Roughly 700K Assist interactions in the first five months, peaking near 192K in February." · coverStat "850K+ upscales · 107K in the peak month" |
| **Plain-spoken / anti-jargon** | "drop an image, pick a model, and get a sharper… result in one step." · "ends the awkward money text, not just the math." |
| **Engineer-literate** | "model-agnostic shell that routes every shot," "one credit pool," "no node graphs," "handed to a React Native build"; tools include "Figma MCP," "Claude AI" |
| **Intellectually honest** | "then held a plateau." · "The win isn't a number yet. It's that the shell held." |
| **Playful / internet-native (personal contexts only)** | "coffeemaxxing + tokenmaxxing," "touching grass," "vibecoded 'slop'," heart-emoji footer |

**Governing rule:** voice is **dual-register and route-gated**. `/work/*` is sober, declarative, metric-led; `/about`, `/playground`, and the footer are warm and slangy. The two never mix — zero jokes in a case study, zero metrics in the About bio. Maintain two copy "modes" gated per route.

### 7.2 Lowercase styling & name system

Lowercase casing is enforced in CSS via `text-transform`, not just typed — it is a system rule.

| Element | Verbatim | Styling |
|---|---|---|
| Nav wordmark | `amanhsn` `·` `product designer` | Satoshi 700, 20px, `letter-spacing:-.2px`, `--text-primary`. `·` + "product designer" are `hidden … sm:inline`. |
| Hero name | `syed aman hussain` | Inter 400, 20px, `text-transform:uppercase`, `letter-spacing:2.8px` (2.2px mobile), `--text-name` |
| Hero role | `Product Designer @ ImagineArt` · `Islamabad, Pakistan` | Satoshi 700, 18px/28.8px, split by a 1px vertical rule (`--border-subtle`) |

Intent: the lowercase `amanhsn` wordmark signals a developer/IndieHacker identity (handle-as-brand). The displayed legal name is rendered uppercase + wide-tracked Inter 400 so it reads as a **typeset credit/label, not a heading**. The middle-dot `·` (U+00B7) is the **universal inline separator** — never a slash, hyphen, or bullet. Do not bold the name.

### 7.3 The hero bio (positioning statement, verbatim)

> "Product designer bridging the gap between engineering, AI, and pure design. I thrive on product research and collaborating with founders and cross-functional teams to transmute raw ideas into polished, impactful products & features. Currently, I'm pushing the boundaries of generative AI to craft intelligent experiences at ImagineArt (Vyro.ai)."

Compressed meta description: *"Product designer bridging engineering, AI, and pure design. Currently at ImagineArt (Vyro.ai)."*

**3-beat formula:** (1) **triangulation thesis** — "bridging the gap between engineering, AI, and pure design" ("pure design" is a third, equal pole); (2) **working style** — "product research… collaborating with founders… to transmute raw ideas into polished, impactful products" (one elevated verb, "transmute," amid plain words); (3) **current proof** — "pushing the boundaries of generative AI… at ImagineArt (Vyro.ai)" (always link the consumer brand to its parent parenthetically).

**Punctuation tells:** typographic apostrophe (`I'm`), ampersand (`products & features`), `(Vyro.ai)` parenthetical.

### 7.4 Experience timeline convention

Rendered `YEAR | COMPANY | ROLE` (year mono, `--text-tertiary`; company `--text-company`; role `--text-tertiary`):

| Year | Company | Role |
|---|---|---|
| 2026 | ImagineArt (Vyro.ai) | Product Designer |
| 2026 | Weel Inc | Founding Product Designer |
| 2024 | Oryns Solutions | Product Designer |
| 2024 | Elite IT Team | UI/UX Designer |
| 2023 | PreMed.PK | UI/UX Design Intern |

Convention: the arc reads as a seniority ladder escalating the **scope word** ("Intern" → "Designer" → "Product Designer" → "Founding"), not the discipline. Keep the year in monospace as a "ledger" cue.

### 7.5 The case-study card formula (homepage)

All 6 cards share an **identical two-paragraph + six-row-table** structure — the most replicable artifact on the site.

- **Paragraph 1 — "What it is" (definitional):** name the product and reframe it via a contrast or metaphor.
- **Paragraph 2 — "What I did / what happened":** a hard metric (IA products) OR an end-to-end process + handoff summary (client work).
- **Meta table — fixed labels, always in this order:** `Year · Role · Scope · Device · Tools · Link`. Label `.t-table-label` (Satoshi, `--text-secondary`, `letter-spacing:.473px`, 15.8px) : value `.t-table-value` (Satoshi 500, `--text-primary`, 16px), divided by `border-top:1px solid var(--border-row)`.

| Project | P1 device | P2 payload | Role | Scope |
|---|---|---|---|---|
| Film Studio | metaphor: "prompt-and-pray clip tool → project-based film environment" | architecture: "model-agnostic shell… one ImagineArt credit pool" | Lead Product Designer | Product Strategy, UI/UX Design, Branding, Prototyping |
| Upscale | "drop an image, pick a model, get a sharper… result in one step" | metric: "849K upscales run, peaking at 107K in a single month" | Lead Product Designer | Product Strategy, UX/UI Design, Prototyping |
| Assist | "conversational front door… reads the intent, picks the model" | metric: "700K Assist interactions… peaking near 192K in February" | Product Designer + Manager | Product Strategy, UX/UI Design, Prototyping |
| Power Zone | "sell uptime to five very different buyers without becoming a parts catalog" | process: "built in Framer end to end… every path resolving to one Contact Sales conversation" | Design, Framer build, brand & content | Brand, Web Design, Framer Development, Content |
| Clinio | "telemedicine MVP… all built accessibility first" | "Designed end to end in 8 weeks for a Belgian client… Handed off as a reusable Figma system for a React build" | Lead Product Designer | Brand, UX Research, UI/UX Design, Prototyping |
| Share Ease | "ends the awkward money text, not just the math" | "Designed end to end in a month… handed to a React Native build" | Product Designer, solo | Branding, UX/UI Design, Prototyping, Web |

**Signature rhetorical moves:**
- **The "X, not Y" reframe** — the single most frequent pattern; default headline shape ("ends the awkward money text, *not just the math*"; "a chat that does, *not just talks*"; "a front door, *not a dead end*"; "New models as rows, *not screens*").
- **One coined pejorative per project** for the "before" state ("prompt-and-pray").
- **A small reusable metaphor lexicon** ("front door," "shell," "director's chair").
- **Scope-honesty markers:** "end to end," "solo."
- **Tools as credibility:** name real tools incl. AI tooling — Mixpanel, Claude AI, Figma MCP, Chatly, Framer, Whimsical.
- **Role strings are descriptive phrases, not bare titles** — "Product Designer + Manager," "Product Designer, solo," "Design, Framer build, brand & content." The `+`, comma-suffix, and lowercase continuation communicate the *shape* of involvement.

### 7.6 The deep case-study spine (`/work/*`)

Fixed, zero-padded numbered narrative — reads like a spec document (reinforces engineer-literate positioning):

**01 Context → 02 The Problem → 03 (process/approach) → 04 Key Decisions → 05 Craft Moment → 06 What Shipped → 07 Outcome → 08 What I Learned → 09 What's Next.**

| Section | Job | Voice |
|---|---|---|
| 01 Context | situate ("Where this lives?" / "Why this feature?") | question-form subheads |
| 02 The Problem | provocative thesis + 3 labeled issues + constraints | aphorism: "Most AI video tools are clip generators dressed up as filmmakers." |
| 04 Key Decisions | 3 decisions: heading + terse bullets + ≥1 before/after | imperative: "Make shell outlive model" |
| 05 Craft Moment | one zoomed-in insight | "Vocabulary is product…" |
| 06 What Shipped | captioned gallery, one-line captions | "The result, in-thread, with the next step offered." |
| 07 Outcome | Status / Reach / Inheritance; honest plateau | "The win isn't a number yet. It's that the shell held." |
| 08 What I Learned | 3 portable maxims (quotable/screenshot-able) | "Vocabulary is product / Constraints are the design / Design the shell, not the model" |
| 09 What's Next | 4-item roadmap | "Close the conversion gap" |

Replicate the exact order — it *is* the brand's argument structure: situate → provoke → decide → zoom in → prove → reframe honestly → generalize → look forward.

### 7.7 Personal-voice cues (warm register)

| Cue | Verbatim | Channel |
|---|---|---|
| Footer attribution | "Designed & Developed with ❤️ by @amanhsn" (heart = U+2764 in `<span aria-hidden="true">`) | every footer |
| Footer links | `BEHANCE · LINKEDIN · CV · SPOTIFY` (Inter, uppercase, 14px) | footer |
| Spotify | links a real Spotify profile — a **peer** to LinkedIn/Behance/CV | hero social row + footer |
| About headline | "Designer, builder & avid music listener" | about |
| About interests | "coffeemaxxing + tokenmaxxing," "touching grass," "curating mixtapes" | about |
| Playground headline | "Side projects, ideas & vibecoded 'slop'" | playground |
| Soft CTA | "Working on something cool? Say hi via LinkedIn · email" | about + playground |
| Asterisk motif | `/asterisk.png` flanking headings (90% light / 15% dark) | all hero sections |

Notes: the footer says "& **Developed**" + an `aria-hidden` heart — reinforcing designer-who-codes even in the credit line. Music is a primary identity link, not a footnote. Slang is real and self-aware ("vibecoded 'slop'," `-maxxing`) but **personal-context only**. The asterisk `*` is the brand's ornamental glyph (footnote/markdown aesthetic, matching the lowercase handle).

### 7.8 Cursor-label microcopy

Voice extends into interaction — every interactive element gets a terse, imperative 1–3-word `data-cursor-text` (no "Click here"):

| Target | Label |
|---|---|
| Get in Touch | `Book a call` |
| Theme toggle | `Dark mode` |
| Project card | `View case study` (+ project name, e.g. `ImagineArt Film Studio`) |
| LinkedIn / Behance / CV / Spotify | `LinkedIn` / `Behance` / `CV` / `Spotify` |

**Consolidated punctuation rules:** middle-dot `·` for all inline separators; typographic apostrophes/quotes; `&` ampersands; comma-spliced rhythm.

---

## 8. Replication Checklist

To build this exact look, do precisely these things:

1. **Stack:** Next.js App Router + Tailwind v4 (`@theme` + `@layer components`) + next/font self-hosted woff2 + next/image, on Vercel. Title "Aman's Portfolio"; ship the meta description verbatim.
2. **Fonts:** load **Satoshi** (Fontshare, 400/500/700) as `--font-sans` (the workhorse); self-host **Inter** (400/500 → `--font-inter`), **Geist Mono** (→ numerals), **DM Mono** (400/500 → micro-labels), **Geist** (→ experience rows only) via next/font with `local("Arial")` metric fallbacks. Apply all four next/font variable classes to `<html>`.
3. **Type:** rebuild the `.t-*` component classes verbatim (§3.2), using **literal px** for size & line-height (including 15.1/15.8/13.5/20.25/22.5/28.8/25.6). Home tops out at 20px; 24–36px lives only on case studies. Numerals go in a mono face — **never** add `font-variant-numeric`. Tracking: uppercase labels get positive tracking scaling inversely with size (10px→2.8px, 14px→0.47px, 20px→2.8px); big Satoshi display gets −0.2 → −0.4px; body 0. Weights 400 / 500 / 700 only.
4. **Color:** author two blocks only — `:root` (light, default, `color-scheme:light`) and `[data-theme=dark]` (`color-scheme:dark`). Copy every hex from §4.2 verbatim, including 8-digit alpha. Build **dark neutrals as `#ffffffNN` alpha** stepped for hierarchy (4% tag → 6% pill → 8% subtle → 14% default → 22% strong; text 92/72/50/32%). Alias `--color-fg*` and the undefined `--border/--divider/--card-border/--fg/--fg-subtle` onto the semantic ramp. No gradients.
5. **Accent discipline:** blue `--accent` (`#0080ff` light / `#39f` dark) for interactive only; green/red exclusively for metric deltas; everything else neutral. There is no accent hover override.
6. **Cursor + selection invert via tokens:** `--cursor-bg/-fg` = text-primary/bg (light), flipped (`#fff`/`#0a0a0b`) dark; `::selection { background: var(--text-primary); color: var(--bg) }`.
7. **Layout:** two rails — nav/footer `max-w-[1441px]`, content `max-w-[1280px]`, both `mx-auto`. Page spine: `<main class="flex flex-col items-center gap-[64px] md:gap-[96px] pt-[32px] md:pt-[64px] pb-[64px] md:pb-[96px]">`. Gutters `px-5 sm:px-8`; nav `lg:px-[52px]`, footer `md:px-[80px] lg:px-[104.5px]`, project sections `lg:px-0`. Breakpoints `sm 640 / md 768 / lg 1024`.
8. **Radii & elevation:** pills (999px) for every interactive control/chip; 8px icon tiles; 16px media cards; 22–28px oversized feature cards. One `--shadow-card` only (`0 4px 15px rgba(0,0,0,.1)` light → `0 4px 20px rgba(0,0,0,.45)` dark); depth otherwise from 1px borders.
9. **Project cards:** flex pair, `gap-8 md:gap-[44px]`, alternate `md:flex-row-reverse`; text col `md:w-[397px] md:h-[597px] md:pr-[18px]`; image `md:w-[839px] aspect-[839/597] rounded-[16px] border-[var(--border-default)] shadow-[var(--shadow-card)]` + Next `fill`/`object-cover`. Meta table: label `w-[72px] sm:w-[75.94px] shrink-0`, value `flex-1`, rows `border-t border-[var(--border-row)] pt-[12px] pb-[12px] sm:pt-[15.247px] sm:pb-[16.5px]`.
10. **Timeline:** `grid grid-cols-[64px_minmax(0,1fr)] sm:grid-cols-[104px_224px_minmax(0,1fr)] items-baseline`; reorder role via `col-start`/`row-start` at `sm`; row stack `gap-[6px] sm:gap-[2px]`.
11. **Glass nav:** `sticky top-0 z-50 h-16 md:h-20`, transparent + borderless at top; on scroll → `bg-[var(--bg)]/85 backdrop-blur` (8px) + `border-b border-[var(--border-subtle)]`, transitioning only `background-color,border-color,backdrop-filter` at `.2s`; pills `h-7 rounded-pill px-[10px]` with `cubic-bezier(.32,.72,0,1)` @ 180ms + the `group/nav` dim-all-spotlight-one hover.
12. **Footer:** `flex-col md:flex-row md:items-end md:justify-between border-t border-[var(--border-subtle)] py-10 md:py-[64px]`; links `hover:opacity-70`.
13. **Motion:** register `cubic-bezier(.32,.72,0,1)` as the premium curve; defaults — color/border `.15s`, pills `.18s`, image zoom `.5s ease-out`, sliders `.12s`. Hovers ≤5% scale (`scale-[1.03]`/`1.05`), arrow `translate-x-1`. Name explicit transition properties, never `transition-all`. Keyboard focus `ring-2 ring-[var(--fg)] ring-offset-2 ring-offset-[var(--bg)]`.
14. **Custom cursor:** build a fixed `pointer-events-none z-[9999]` lerp follower; gate behind `data-cursor-active` set after mount + `(pointer:coarse)`/`(prefers-reduced-motion)` checks (native cursor on touch/reduced-motion); implement the `data-cursor` / `-text` / `-keep` / `-native`(crosshair) API; fill `--cursor-bg`, text `--cursor-fg`, shadow `--cursor-shadow`.
15. **Scroll reveals:** SSR each block with `opacity:0; transform:translateY(12–16px)` (header `-40px`), intersection-animate to rest with `ease-out` ~.3–.5s, slight stagger.
16. **Route transitions:** wire View Transitions but disable the animation (`::view-transition { animation: none }`) for instant route changes.
17. **Voice — dual register, route-gated:** sober + metric on `/work/*`; warm + slang on `/about`, `/playground`, footer; never blend.
18. **Copy formulas:** open the bio with the engineering/AI/pure-design triangulation + `(Vyro.ai)` parenthetical; card P1 = definitional "X, not Y" reframe, P2 = a hard metric (real number + peak, e.g. "849K… peaking at 107K") OR end-to-end process + handoff; fixed meta rows `Year · Role · Scope · Device · Tools · Link` with role as a descriptive phrase; deep case studies use the `01–09` spine ending on an honest outcome.
19. **Brand glyphs & strings:** lowercase `amanhsn` wordmark (700, −0.2px) + `· product designer` at `sm`; name uppercased via `text-transform` in Inter 400 @ 2.8px; middle-dot `·` as the only inline separator; asterisk `*` ornament flanking heroes (90% light / 15% dark); footer "Designed & Developed with ❤️ by @amanhsn"; Spotify as a first-class social link; terse imperative cursor labels ("Book a call," "View case study").
