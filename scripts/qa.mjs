/**
 * Visual and structural QA over the built export. Serves out/, then checks
 * what the round-25 design (the ceramic) promises:
 *   - no horizontal overflow at any width from 360 to 1920, on every route;
 *   - the one thing that moves is Fig. 0, the knot on the home page: no
 *     CSS animation, no autoplay, nothing sticky or fixed but the close
 *     view beside the work; the knot turns, and with reduced motion it
 *     holds one frame — and still changes shape for the row you point at;
 *   - the first screen at 1440×900 holds the line over it, the opening
 *     sentence and the three facts; at 390 it holds the sentence;
 *   - one family (Archivo, loaded) for every word; nothing under 13px;
 *   - the colour law: red only on what said no;
 *   - every work row opens its write-up and prints a number;
 *   - the count of what didn't work agrees on both pages and with its rows;
 *   - write-ups have one h1, a figure and a plain summary;
 *   - no route logs an error; hover changes no content.
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
// WebGL in headless Chromium runs on SwiftShader.
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
const browser = await chromium.launch(
  process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM, args: GL } : { args: GL },
);

// The routes follow the content model, so a withheld system (GEDANKEN_PUBLIC) is neither checked nor expected.
const ROUTES = ["/", "/said-no/", ...systems.map((s) => `/systems/${s.slug}/`), ...publications.map((p) => `/papers/${p.slug}/`)];
const CASES = ROUTES.filter((r) => r.startsWith("/systems/") || r.startsWith("/papers/"));
const REDS = ["rgb(198, 58, 27)"];

const errors = [];
async function open(path, width, height = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, ...opts });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${path} @${width}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${path} @${width}: ${m.text()}`));
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

/* ---- 2. the one thing that moves is Fig. 0 ------------------------ */
for (const path of ROUTES) {
  const { ctx, page } = await open(path, 1440);
  await page.waitForTimeout(1500);
  const report = await page.evaluate(() => {
    const out = { animations: document.getAnimations().length, slow: [], autoplay: 0, pinned: [] };
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.transitionDuration.split(",").some((d) => parseFloat(d) > 0.2)) out.slow.push(el.className || el.tagName);
      if ((cs.position === "sticky" || cs.position === "fixed") && !el.matches(".skip, .show-side")) out.pinned.push(el.className || el.tagName);
    }
    out.autoplay = document.querySelectorAll("[autoplay]").length;
    return out;
  });
  if (report.animations) fail(`${path}: ${report.animations} CSS animation(s) running with no input`);
  if (report.slow.length) fail(`${path}: transitions over 0.2s on ${report.slow.slice(0, 5).join(", ")}`);
  if (report.autoplay) fail(`${path}: ${report.autoplay} autoplay element(s)`);
  if (report.pinned.length) fail(`${path}: sticky/fixed ${report.pinned.slice(0, 5).join(", ")}`);
  await ctx.close();
}
{
  // Fig. 0 lives: both views are up, and the knot turns (the first view changes between two looks)
  const { ctx, page } = await open("/", 1440);
  await page.waitForTimeout(2500);
  const state = await page.evaluate(() =>
    [...document.querySelectorAll("[data-stage]")].map((s) => ({ on: s.classList.contains("on"), gl: !s.classList.contains("no-gl"), form: s.getAttribute("data-form") })),
  );
  if (state.length !== 2 || state.some((s) => !s.on || !s.gl || !s.form)) fail(`/: Fig. 0 is not up (${JSON.stringify(state)})`);
  const look = () => page.locator('[data-stage="hero"]').screenshot({ timeout: 120000 });
  const a = await look();
  await page.waitForTimeout(3000);
  if (a.equals(await look())) fail("/: Fig. 0 is up but nothing moves");
  await ctx.close();
}
{
  // …and with reduced motion it is one still frame, which still takes the shape of the row you point at
  const { ctx, page } = await open("/", 1440, 900, { reducedMotion: "reduce" });
  // the glaze's shaders take a while to compile on a software GPU; the still frame comes after
  await page.waitForTimeout(8000);
  const look = () => page.locator('[data-stage="hero"]').screenshot({ timeout: 120000 });
  const a = await look();
  await page.waitForTimeout(2500);
  if (!a.equals(await look())) fail("/: Fig. 0 moves under reduced motion");
  await page.locator('a.row[data-form="loci"]').hover();
  const r = await page.evaluate(() => ({
    here: [...document.querySelectorAll("a.row.here")].map((x) => x.getAttribute("data-form")),
    forms: [...document.querySelectorAll("[data-stage]")].map((s) => s.getAttribute("data-form")),
  }));
  if (r.here.join() !== "loci" || r.forms.some((f) => f !== "loci")) fail(`/: pointing at loci does not show its knot (${JSON.stringify(r)})`);
  await ctx.close();
}

/* ---- 3. the first screen ------------------------------------------ */
{
  const { ctx, page } = await open("/", 1440, 900);
  await page.waitForTimeout(3000);
  const f = await page.evaluate(() => {
    const b = (sel) => document.querySelector(sel).getBoundingClientRect().bottom;
    return { kicker: b(".kicker"), line: b(".hero h1"), facts: b(".hero-facts") };
  });
  for (const [k, v] of Object.entries(f)) if (v > 900) fail(`/ @1440×900: ${k} ends at ${Math.round(v)}px, below the fold`);
  await page.screenshot({ path: `${SHOTS}/home-1440-fold.png`, timeout: 120000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/home-1440.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}
{
  const { ctx, page } = await open("/", 390, 844);
  const b = await page.evaluate(() => document.querySelector(".hero h1").getBoundingClientRect().bottom);
  if (b > 844) fail(`/ @390: the line misses the first screen (${Math.round(b)})`);
  await page.screenshot({ path: `${SHOTS}/home-390-fold.png`, timeout: 120000 });
  await ctx.close();
}

/* ---- 4. two families, the colour law ------------------------------- */
for (const path of ROUTES) {
  for (const width of [1440, 390]) {
    const { ctx, page } = await open(path, width);
    const r = await page.evaluate(({ REDS }) => {
      const root = getComputedStyle(document.documentElement);
      const name = (v) => root.getPropertyValue(v).split(",")[0].trim().replace(/['"]/g, "");
      const FAMS = ["--font-archivo"].map(name);
      const first = (el) => getComputedStyle(el).fontFamily.split(",")[0].trim().replace(/['"]/g, "");
      const out = { family: [], small: [], red: [], loaded: FAMS.filter((f) => !document.fonts.check(`16px "${f}"`)) };
      const RED_OK = "[data-ink='neg'], .neg, .i-neg, .note, .count, .lrow .x, .sn.hat, .nd.hat, .lines text.neg, .ledger";
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("[data-sr], .sr, .skip, svg defs, script, style, noscript, pre")) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        const tag = `${el.tagName}.${el.className?.baseVal ?? el.className}`;
        if (ownText) {
          if (!FAMS.includes(first(el))) out.family.push(`${tag}: ${cs.fontFamily}`);
          if (parseFloat(cs.fontSize) < 13) out.small.push(`${tag} ${cs.fontSize}`);
        }
        const paints = (c) => (ownText && cs.color === c) || cs.backgroundColor === c || (cs.borderTopColor === c && parseFloat(cs.borderTopWidth) > 0);
        if (REDS.some(paints) && !el.closest(RED_OK) && !el.matches(".lrow:hover *")) out.red.push(tag);
      }
      return out;
    }, { REDS });
    const cap = (a) => a.slice(0, 6).join(" | ");
    if (r.loaded.length) fail(`${path} @${width}: font not loaded: ${cap(r.loaded)}`);
    if (r.family.length) fail(`${path} @${width}: a second font family: ${cap(r.family)}`);
    if (r.small.length) fail(`${path} @${width}: text below 13px: ${cap(r.small)}`);
    if (r.red.length) fail(`${path} @${width}: red on something that did not say no: ${cap(r.red)}`);
    await ctx.close();
  }
}
{
  const { ctx, page } = await open("/", 1440);
  const entries = await page.evaluate(() =>
    [...document.querySelectorAll("#work .rows li")].map((c) => ({
      id: c.id,
      writeup: c.querySelector("a.row")?.getAttribute("href") ?? "",
      num: c.querySelector(".row-num")?.textContent.trim() ?? "",
    })),
  );
  if (entries.length !== systems.length) fail(`/: ${entries.length} work rows for ${systems.length} systems`);
  for (const c of entries) {
    if (c.writeup !== `/systems/${c.id}/`) fail(`/: row ${c.id} does not open its write-up`);
    if (!c.num) fail(`/: row ${c.id} has no number`);
  }
  await ctx.close();
}

/* ---- 5. the count of what didn't work agrees ------------------------ */
{
  const { ctx, page } = await open("/", 1440);
  const home = await page.evaluate(() => Number(document.querySelector(".ledger b").textContent.trim()));
  await ctx.close();
  const s = await open("/said-no/", 1440);
  const said = await s.page.evaluate(() => ({
    count: Number(document.querySelector(".page-lede .count").textContent.trim()),
    rows: document.querySelectorAll(".lrow").length,
  }));
  await s.ctx.close();
  if (said.count !== said.rows) fail(`/said-no/: says ${said.count} but lists ${said.rows}`);
  if (home !== said.count) fail(`/: the ledger says ${home} but /said-no/ counts ${said.count}`);
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

/* ---- 10c. the home page ships only its own script; the ledger none -- */
{
  const home = await readFile(`${OUT}/index.html`, "utf8");
  const scripts = home.match(/<script\b[^>]*>/gi) ?? [];
  if (scripts.length !== 2 || !/type="importmap"/.test(scripts[0]) || !/src="\/fig0\.js"/.test(scripts[1]))
    fail(`index.html: expected only the import map and /fig0.js, found ${scripts.join(" ")}`);
  const said = await readFile(`${OUT}/said-no/index.html`, "utf8");
  if (/<script\b/i.test(said)) fail("said-no/index.html: the exported page contains a <script>");
}

/* ---- 11. hover changes no content --------------------------------- */
{
  const { ctx, page } = await open("/", 1440);
  const text = () => page.evaluate(() => {
    const c = document.body.cloneNode(true);
    // the caption under the close view is part of the picture, not the text
    c.querySelectorAll(".pin").forEach((el) => el.remove());
    return c.innerText;
  });
  const before = await text();
  for (const sel of ["a.row", ".go", ".nav a", ".mail"]) {
    const n = await page.locator(sel).count();
    for (let i = 0; i < n; i++) await page.locator(sel).nth(i).hover();
  }
  if (before !== (await text())) fail("/: hovering changed the page's text");
  await ctx.close();
}

for (const e of errors) fail(`console: ${e}`);

await browser.close();
server.close();

if (failures.length) {
  console.error(`\nqa: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  · ${f}`);
  console.error("");
  process.exit(1);
}
console.log(`qa: ${ROUTES.length} routes · no overflow 360–1920 · only the knot moves, and holds still under reduced motion · first screen holds · one family · the colour law · work rows open write-ups · the count agrees · no errors.`);
