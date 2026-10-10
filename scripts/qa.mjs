/**
 * Visual and structural QA over the built export. Serves out/, then checks
 * what THE GUESS promises:
 *   - no horizontal overflow at any width from 360 to 1920, on every route;
 *   - nothing plays by itself: no animations, no transitions, no autoplay,
 *     nothing sticky or fixed;
 *   - the first screen: the opening, the portrait and what he is building
 *     inside 1440×900; the opening inside 390×844;
 *   - the portrait's top on the opening's cap line, at ≥1024;
 *   - five shared column starts on the home page (1, 2, 4, 9 and the right
 *     edge), at ≥1024, and one left edge at every width;
 *   - three faces and a budget: Newsreader display, Newsreader text and
 *     Hanken Grotesk only; at most 8 sizes and 2 weights a face on the home
 *     page; nothing under 13px; no uppercase transforms, no positive
 *     tracking;
 *   - the colour law: oxblood only on the opening's full stop and on what
 *     said no;
 *   - the portrait is colour and not lazy;
 *   - the ledger count agrees on both pages, with its rows and with every
 *     "N said no";
 *   - case pages have one h1, a figure and a plate;
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
const SIGNAL = ["rgb(122, 30, 44)"];

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
    return { opening: b(".opening"), portrait: b(".portrait img"), building: b(".stand .building") };
  });
  for (const [k, v] of Object.entries(f)) if (v > 900) fail(`/ @1440×900: ${k} ends at ${Math.round(v)}px, below the fold`);
  await page.screenshot({ path: `${SHOTS}/home-1440-fold.png`, timeout: 120000 });
  await page.screenshot({ path: `${SHOTS}/home-1440.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}
{
  const { ctx, page } = await open("/", 390, 844);
  const b = await page.evaluate(() => document.querySelector(".opening").getBoundingClientRect().bottom);
  if (b > 844) fail(`/ @390: the opening misses the first screen (${Math.round(b)})`);
  await page.screenshot({ path: `${SHOTS}/home-390-fold.png`, timeout: 120000 });
  await page.screenshot({ path: `${SHOTS}/home-390.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}
for (const width of [1024, 768]) {
  const { ctx, page } = await open("/", width, 800);
  await page.screenshot({ path: `${SHOTS}/home-${width}.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}

/* ---- 4. the portrait on the cap line ------------------------------ */
for (const width of [1024, 1280, 1440, 1920]) {
  const { ctx, page } = await open("/", width);
  // The opening is set with text-box: trim-both cap alphabetic, so its box
  // starts on the cap line of its first letter.
  const g = await page.evaluate(() => ({
    pt: document.querySelector(".portrait img").getBoundingClientRect().top,
    cap: document.querySelector(".opening").getBoundingClientRect().top,
  }));
  if (width >= 1024 && Math.abs(g.pt - g.cap) > 1) fail(`/ @${width}: portrait top ${Math.round(g.pt)} is not on the cap line ${Math.round(g.cap)}`);
  await ctx.close();
}

/* ---- 5. shared column starts -------------------------------------- */
for (const width of [1920, 1440, 1024, 768, 375]) {
  const { ctx, page } = await open("/", width);
  const edges = await page.evaluate(() => {
    const at = (sel, side = "left") => {
      const els = [...document.querySelectorAll(sel)].filter((el) => getComputedStyle(el).display !== "none");
      if (!els.length) return [[sel, null]];
      return els.map((el) => [sel, Math.round(el.getBoundingClientRect()[side])]);
    };
    return {
      left: [".top .who", ".opening", ".stand", ".sh h2", ".nm", ".foot .who", ".closer", ".way:first-child"].flatMap((s) => at(s)),
      one: [".top .who", ".opening", ".stand", ".sh h2", ".nm", ".rule", ".st.wide", ".foot .who", ".closer"].flatMap((s) => at(s)),
      four: [".top .role", ".sh .sl", ".w .st", ".rec .st"].flatMap((s) => at(s)),
      nine: [".ms", ".src", ".way:nth-child(3)"].flatMap((s) => at(s)),
      right: [".top nav", ".portrait", ".foot .aside", ".sh"].flatMap((s) => at(s, "right")),
    };
  });
  const groups = width >= 1024 ? ["one", "four", "right"] : ["left"];
  for (const k of groups) {
    const list = edges[k];
    const missing = list.filter(([, x]) => x === null).map(([s]) => s);
    if (missing.length) fail(`/ @${width}: missing selector(s) ${missing.join(", ")}`);
    const xs = list.filter(([, x]) => x !== null).map(([, x]) => x);
    if (Math.max(...xs) - Math.min(...xs) > 1) {
      const seen = [...new Map(list.map(([s, x]) => [`${s}=${x}`, 1])).keys()];
      fail(`/ @${width}: the "${k}" edge disagrees: ${seen.join(" ")}`);
    }
  }
  if (width >= 1024) {
    // column 9 holds the numbers and the sources; the bet sits on column 5 of the stand's own nine.
    const nine = edges.nine.map(([, x]) => x);
    if (Math.max(...nine) - Math.min(...nine) > 1) fail(`/ @${width}: column 9 disagrees: ${edges.nine.map(([s, x]) => `${s}=${x}`).join(" ")}`);
  }
  await ctx.close();
}

/* ---- 6–8. type, colour, portrait on every route ------------------- */
for (const path of ROUTES) {
  for (const width of [1440, 390]) {
    const { ctx, page } = await open(path, width);
    const r = await page.evaluate((SIGNAL) => {
      // the arrows face (unicode-range U+2190–21FF) heads every serif stack; the face that sets the words is the next one
      const first = (el) => getComputedStyle(el).fontFamily.split(",").map((f) => f.trim().replace(/['"]/g, "")).find((f) => !/arrows/i.test(f));
      const DISPLAY = first(document.querySelector(".opening, .cname, .lost h1"));
      const TEXT = first(document.body);
      const SANS = first(document.querySelector(".top .role"));
      const out = { family: [], small: [], upper: [], tracking: [], red: [], sizes: {}, weights: {} };
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("[data-sr], .sr, .skip, svg defs, script, style")) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (ownText) {
          const fam = first(el);
          if (![DISPLAY, TEXT, SANS].includes(fam)) out.family.push(`${el.tagName}.${el.className?.baseVal ?? el.className}: ${cs.fontFamily}`);
          const size = parseFloat(cs.fontSize);
          if (size < 12.5) out.small.push(`${el.tagName}.${el.className?.baseVal ?? el.className} ${size}px "${el.textContent.trim().slice(0, 30)}"`);
          if (cs.textTransform === "uppercase") out.upper.push(el.className || el.tagName);
          if (parseFloat(cs.letterSpacing) > 0) out.tracking.push(el.className || el.tagName);
          if (!el.closest("figure, .tw, .schem")) {
            out.sizes[cs.fontSize] = 1;
            (out.weights[fam] ??= {})[cs.fontWeight] = 1;
          }
        }
        const paint = [cs.color, cs.backgroundColor, cs.borderTopColor, cs.borderLeftColor, cs.borderRightColor, cs.borderBottomColor, cs.backgroundImage, cs.boxShadow, cs.fill, cs.stroke].join(" ");
        if (!SIGNAL.some((c) => paint.includes(c))) continue;
        const visible =
          (SIGNAL.some((c) => cs.color.includes(c)) && ownText) ||
          SIGNAL.some((c) => cs.backgroundColor.includes(c) || cs.backgroundImage.includes(c) || cs.boxShadow.includes(c)) ||
          ["Top", "Right", "Bottom", "Left"].some((k) => SIGNAL.some((c) => cs[`border${k}Color`].includes(c)) && parseFloat(cs[`border${k}Width`]) > 0) ||
          (el instanceof SVGElement && SIGNAL.some((c) => (cs.fill + cs.stroke).includes(c)));
        if (visible && !el.closest('[data-ink="neg"], .opening .stop, .cs.neg, .note, .lg:target, .cs:target')) out.red.push(`${el.tagName}.${el.className?.baseVal ?? el.className}`);
      }
      const img = document.querySelector(".portrait img");
      const portrait = img ? { filter: getComputedStyle(img).filter, loading: img.getAttribute("loading") } : null;
      const fontOk = [DISPLAY, TEXT, SANS].every((f) => document.fonts.check(`16px "${f}"`)) && new Set([DISPLAY, TEXT, SANS]).size === 3;
      return { ...out, sizes: Object.keys(out.sizes), weights: Object.fromEntries(Object.entries(out.weights).map(([k, v]) => [k, Object.keys(v)])), portrait, fontOk, fams: `${DISPLAY} / ${TEXT} / ${SANS}` };
    }, SIGNAL);
    const cap = (a) => a.slice(0, 6).join(" | ");
    if (!r.fontOk) fail(`${path} @${width}: faces "${r.fams}" are not three loaded families`);
    if (r.family.length) fail(`${path} @${width}: a fourth font family: ${cap(r.family)}`);
    if (r.small.length) fail(`${path} @${width}: text below the floor: ${cap(r.small)}`);
    if (r.upper.length) fail(`${path} @${width}: uppercase transform on ${cap(r.upper)}`);
    if (r.tracking.length) fail(`${path} @${width}: positive tracking on ${cap(r.tracking)}`);
    if (r.red.length) fail(`${path} @${width}: oxblood outside a said-no mark: ${cap(r.red)}`);
    if (path === "/") {
      if (r.sizes.length > 9) fail(`/ @${width}: ${r.sizes.length} type sizes (${r.sizes.join(", ")}); the budget is 9`);
      for (const [fam, ws] of Object.entries(r.weights)) if (ws.length > 2) fail(`/ @${width}: ${fam} in ${ws.length} weights (${ws.join(", ")})`);
      if (r.portrait?.filter !== "none") fail(`/ @${width}: portrait is filtered (${r.portrait?.filter})`);
      if (r.portrait?.loading === "lazy") fail(`/ @${width}: portrait is lazy-loaded`);
    }
    await ctx.close();
  }
}

/* ---- 9. the ledger agrees with itself ----------------------------- */
{
  const { ctx, page } = await open("/", 1440);
  const home = await page.evaluate(() => ({
    tally: Number(document.querySelector(".tally .n").textContent.trim()),
    links: [...document.querySelectorAll(".w a.mk")].map((a) => ({ href: a.getAttribute("href"), n: null })),
  }));
  await ctx.close();
  const s = await open("/said-no/", 1440);
  const said = await s.page.evaluate(() => ({
    count: Number(document.querySelector('.tallyrow .n [aria-hidden="true"]').textContent.trim()),
    rows: document.querySelectorAll(".lrow").length,
    groups: Object.fromEntries([...document.querySelectorAll(".lg")].map((g) => [g.id, g.querySelectorAll(".lrow").length])),
  }));
  await s.ctx.close();
  if (said.count !== said.rows) fail(`/said-no/: numeral ${said.count} but ${said.rows} rows`);
  if (home.tally !== said.count) fail(`/: tally ${home.tally} but /said-no/ counts ${said.count}`);
  if (!home.links.length) fail('/: no "N said no" links on the work rows');
  for (const k of home.links) {
    const id = k.href.split("#")[1];
    if (!said.groups[id]) fail(`/: "Said no" → ${k.href} lands on no ledger group`);
  }
}

/* ---- 10. case pages ----------------------------------------------- */
for (const path of CASES) {
  const { ctx, page } = await open(path, 1440);
  const c = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    figs: document.querySelectorAll(".cfig").length,
    plate: document.querySelectorAll(".plate").length,
    held: [...document.querySelectorAll(".cs:not(.neg)")].length,
  }));
  if (c.h1 !== 1) fail(`${path}: ${c.h1} h1 elements`);
  if (!c.figs) fail(`${path}: no figure`);
  if (!c.plate) fail(`${path}: no plate`);
  const name = path.replace(/\//g, "_").replace(/^_|_$/g, "");
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}

/* ---- 10b. a case name never runs into its tagline -------------------- */
for (const path of [...CASES, "/said-no/"]) {
  for (const width of [1024, 1280, 1366, 1440]) {
    const { ctx, page } = await open(path, width);
    const gap = await page.evaluate(() => {
      const h = document.querySelector(".cname");
      const t = document.querySelector(".ctag");
      const r = document.createRange();
      r.selectNodeContents(h);
      return t.getBoundingClientRect().left - r.getBoundingClientRect().right;
    });
    if (gap < 24) fail(`${path} @${width}: the name comes within ${Math.round(gap)}px of its tagline`);
    await ctx.close();
  }
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
  for (const sel of [".row", ".nm h3 a", ".go a", "a.mk"]) {
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
console.log(`qa: ${ROUTES.length} routes · no overflow 360–1920 · nothing moves · first screen, cap line and five column starts hold · three faces within budget · oxblood only on the full stop and what said no · the ledger agrees.`);
