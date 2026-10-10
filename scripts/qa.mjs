/**
 * Visual and structural QA over the built export. Serves out/, then checks
 * what the round-19 design promises:
 *   - no horizontal overflow at any width from 360 to 1920, on every route;
 *   - nothing plays by itself: no animations, no transitions, no autoplay,
 *     nothing sticky or fixed;
 *   - the first screen at 1440×900 holds the headline, the buttons and the
 *     photo; at 390 it holds the headline;
 *   - one family (Geist) for every word; nothing under 12.5px; no uppercase
 *     transforms;
 *   - the orange is a dot: on the home page it touches only the headline's
 *     full stop and the "now" dots;
 *   - every project card opens its write-up and links its code;
 *   - the count of what didn't work agrees on both pages and with its rows;
 *   - write-ups have one h1, a figure and a plain summary;
 *   - hover changes no content.
 * Screenshots land in scripts/.qa/; the exit code is what matters.
 */
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";
import { publications, systems } from "../lib/content.ts";

const OUT = "out";
const SHOTS = "scripts/.qa";
const PORT = 4460;
const TYPES = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".mp4": "video/mp4",
  ".pdf": "application/pdf", ".txt": "text/plain", ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const candidates = url.endsWith("/")
    ? [join(OUT, url, "index.html")]
    : [join(OUT, url), join(OUT, `${url}.html`), join(OUT, url, "index.html")];
  for (const c of candidates) {
    const p = normalize(c);
    if (!p.startsWith(OUT) || !existsSync(p)) continue;
    try {
      const body = await readFile(p);
      res.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
      res.end(body);
      return;
    } catch {
      /* fall through */
    }
  }
  res.writeHead(404).end("not found");
});
await new Promise((r) => server.listen(PORT, r));
await mkdir(SHOTS, { recursive: true });

const base = `http://localhost:${PORT}`;
const failures = [];
const fail = (m) => failures.push(m);
const browser = await chromium.launch();

// The routes follow the content model, so a withheld system (GEDANKEN_PUBLIC) is neither checked nor expected.
const ROUTES = ["/", "/said-no/", ...systems.map((s) => `/systems/${s.slug}/`), ...publications.map((p) => `/papers/${p.slug}/`)];
const CASES = ROUTES.filter((r) => r.startsWith("/systems/") || r.startsWith("/papers/"));
const ORANGE = ["rgb(255, 79, 0)", "rgb(194, 65, 12)"];

async function open(path, width, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page };
}

/* ---- 1. no horizontal overflow, every route, every width ---------- */
for (const path of ROUTES) {
  for (const width of [360, 375, 390, 768, 1024, 1280, 1440, 1920]) {
    const { ctx, page } = await open(path, width);
    const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (sw > iw) fail(`${path} @${width}: horizontal overflow (${sw} > ${iw})`);
    await ctx.close();
  }
}

/* ---- 2. nothing plays by itself ----------------------------------- */
for (const path of ROUTES) {
  const { ctx, page } = await open(path, 1440);
  await page.waitForTimeout(2000);
  const report = await page.evaluate(() => {
    const out = { animations: document.getAnimations().length, transitions: [], autoplay: 0, pinned: [] };
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.transitionDuration.split(",").some((d) => parseFloat(d) > 0)) out.transitions.push(el.className || el.tagName);
      if ((cs.position === "sticky" || cs.position === "fixed") && !el.classList.contains("skip")) out.pinned.push(el.className || el.tagName);
    }
    out.autoplay = document.querySelectorAll("[autoplay]").length;
    return out;
  });
  if (report.animations) fail(`${path}: ${report.animations} animation(s) running with no input`);
  if (report.transitions.length) fail(`${path}: transitions on ${report.transitions.slice(0, 5).join(", ")}`);
  if (report.autoplay) fail(`${path}: ${report.autoplay} autoplay element(s)`);
  if (report.pinned.length) fail(`${path}: sticky/fixed ${report.pinned.slice(0, 5).join(", ")}`);
  await ctx.close();
}

/* ---- 3. the first screen ------------------------------------------ */
{
  const { ctx, page } = await open("/", 1440, 900);
  const f = await page.evaluate(() => {
    const b = (sel) => document.querySelector(sel).getBoundingClientRect().bottom;
    return { headline: b(".hero h1"), buttons: b(".hero .actions"), photo: b(".portrait img") };
  });
  for (const [k, v] of Object.entries(f)) if (v > 900) fail(`/ @1440×900: ${k} ends at ${Math.round(v)}px, below the fold`);
  await page.screenshot({ path: `${SHOTS}/home-1440-fold.png`, timeout: 120000 });
  await page.screenshot({ path: `${SHOTS}/home-1440.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}
{
  const { ctx, page } = await open("/", 390, 844);
  const b = await page.evaluate(() => document.querySelector(".hero h1").getBoundingClientRect().bottom);
  if (b > 844) fail(`/ @390: the headline misses the first screen (${Math.round(b)})`);
  await page.screenshot({ path: `${SHOTS}/home-390.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}
for (const width of [1024, 768]) {
  const { ctx, page } = await open("/", width, 800);
  await page.screenshot({ path: `${SHOTS}/home-${width}.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}

/* ---- 4. one family, the dot law, the cards -------------------------- */
for (const path of ROUTES) {
  for (const width of [1440, 390]) {
    const { ctx, page } = await open(path, width);
    const r = await page.evaluate((ORANGE) => {
      const fam = (el) => getComputedStyle(el).fontFamily.split(",")[0].trim().replace(/['"]/g, "");
      const BODY = fam(document.body);
      const out = { family: [], small: [], upper: [], orange: [] };
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("[data-sr], .sr, .skip, svg defs, script, style, pre")) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (ownText) {
          if (fam(el) !== BODY) out.family.push(`${el.tagName}.${el.className?.baseVal ?? el.className}: ${cs.fontFamily}`);
          if (parseFloat(cs.fontSize) < 12.5) out.small.push(`${el.tagName}.${el.className?.baseVal ?? el.className} ${cs.fontSize}`);
          if (cs.textTransform === "uppercase") out.upper.push(el.className || el.tagName);
        }
        if (location.pathname === "/") {
          const paint = [cs.color, cs.backgroundColor, cs.borderTopColor, cs.boxShadow, cs.textDecorationColor].join(" ");
          const hit = ORANGE.some((c) => (ownText && cs.color.includes(c)) || cs.backgroundColor.includes(c));
          if (hit && !el.matches(".stop, .dot")) out.orange.push(`${el.tagName}.${el.className}`);
          void paint;
        }
      }
      return { ...out, BODY, geist: /geist/i.test(BODY) && document.fonts.check(`16px "${BODY}"`) };
    }, ORANGE);
    const cap = (a) => a.slice(0, 6).join(" | ");
    if (!r.geist) fail(`${path} @${width}: body family "${r.BODY}" is not the loaded Geist`);
    if (r.family.length) fail(`${path} @${width}: a second font family: ${cap(r.family)}`);
    if (r.small.length) fail(`${path} @${width}: text below 12.5px: ${cap(r.small)}`);
    if (r.upper.length) fail(`${path} @${width}: uppercase transform on ${cap(r.upper)}`);
    if (r.orange.length) fail(`${path} @${width}: orange outside a dot: ${cap(r.orange)}`);
    await ctx.close();
  }
}
{
  const { ctx, page } = await open("/", 1440);
  const cards = await page.evaluate(() =>
    [...document.querySelectorAll(".card")].map((c) => ({
      id: c.id,
      writeup: c.querySelector("h3 a")?.getAttribute("href") ?? "",
      code: c.querySelector(".repo")?.getAttribute("href") ?? "",
      num: c.querySelector(".num")?.textContent.trim() ?? "",
    })),
  );
  if (cards.length !== systems.length) fail(`/: ${cards.length} project cards for ${systems.length} systems`);
  for (const c of cards) {
    if (c.writeup !== `/systems/${c.id}/`) fail(`/: card ${c.id} does not open its write-up`);
    if (!c.code.startsWith("https://github.com/")) fail(`/: card ${c.id} has no code link`);
    if (!c.num) fail(`/: card ${c.id} has no result`);
  }
  await ctx.close();
}

/* ---- 5. the count of what didn't work agrees ------------------------ */
{
  const { ctx, page } = await open("/", 1440);
  const home = await page.evaluate(() => Number(/See all (\d+)/.exec(document.querySelector(".more").textContent)[1]));
  await ctx.close();
  const s = await open("/said-no/", 1440);
  const said = await s.page.evaluate(() => ({
    count: Number(document.querySelector(".page-lede .count").textContent.trim()),
    rows: document.querySelectorAll(".lrow").length,
  }));
  await s.ctx.close();
  if (said.count !== said.rows) fail(`/said-no/: says ${said.count} but lists ${said.rows}`);
  if (home !== said.count) fail(`/: "See all ${home}" but /said-no/ counts ${said.count}`);
}

/* ---- 10. case pages ----------------------------------------------- */
for (const path of CASES) {
  const { ctx, page } = await open(path, 1440);
  const c = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    figs: document.querySelectorAll(".cfig").length,
    summary: document.querySelectorAll(".summary .num").length,
  }));
  if (c.h1 !== 1) fail(`${path}: ${c.h1} h1 elements`);
  if (!c.figs) fail(`${path}: no figure`);
  if (!c.summary) fail(`${path}: no plain summary`);
  const name = path.replace(/\//g, "_").replace(/^_|_$/g, "");
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}

/* ---- 10c. the home page and the ledger ship no JavaScript --------- */
for (const file of ["index.html", "said-no/index.html"]) {
  const html = await readFile(`${OUT}/${file}`, "utf8");
  if (/<script\b/i.test(html)) fail(`${file}: the exported page contains a <script>`);
}

/* ---- 11. hover changes no content --------------------------------- */
{
  const { ctx, page } = await open("/", 1440);
  const before = await page.evaluate(() => document.body.innerText);
  for (const sel of [".card", ".btn", ".row", ".principles li"]) {
    const n = await page.locator(sel).count();
    for (let i = 0; i < n; i++) await page.locator(sel).nth(i).hover();
  }
  const after = await page.evaluate(() => document.body.innerText);
  if (before !== after) fail("/: hovering changed the page's text");
  await ctx.close();
}

await browser.close();
server.close();

if (failures.length) {
  console.error(`\nqa: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  · ${f}`);
  console.error("");
  process.exit(1);
}
console.log(`qa: ${ROUTES.length} routes · no overflow 360–1920 · nothing moves · first screen holds · one family · orange only as a dot · cards open write-ups and code · the count agrees.`);
