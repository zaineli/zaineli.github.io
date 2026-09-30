/**
 * Visual and structural QA over the built export. Serves out/, then checks
 * what AGAINST THE CONTROL promises:
 *   - no horizontal overflow at any width from 360 to 1920, on every route;
 *   - nothing plays by itself: no animations, no transitions, no autoplay,
 *     nothing sticky or fixed;
 *   - the first screen: the thesis, the portrait and the results table's
 *     head row inside 1440×900; the thesis and the portrait inside 390×844;
 *   - the portrait's top on the thesis's cap line and its bottom on the
 *     standfirst's last line, at ≥1024;
 *   - one left edge, and the results table's column starts (1, 4, 7) and
 *     the portrait's (10) shared by every table on the page, at ≥1024;
 *   - two families and one rule: Source Serif 4 for what is read, Hanken
 *     Grotesk for what is measured; no text under 13px, nothing under 14px
 *     outside a figure or table; no uppercase transforms, no positive
 *     tracking;
 *   - the colour law: the signal red touches only a result that said no;
 *   - the portrait is colour and not lazy;
 *   - every results row has a captioned figure;
 *   - the ledger count agrees with its rows and with every "N said no";
 *   - case pages have one h1, a figure and a plate, and the results filter
 *     works by click;
 *   - hover changes no content.
 * Screenshots land in scripts/.qa/; the exit code is what matters.
 */
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

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

const ROUTES = ["/", "/systems/engram/", "/systems/whetstone/", "/systems/spindle/", "/systems/reverie/", "/papers/conoid/"];
const SIGNAL = ["rgb(207, 46, 27)", "rgb(179, 38, 26)"];

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
    return { thesis: b(".thesis"), portrait: b(".portrait"), head: b("#systems .sh") };
  });
  for (const [k, v] of Object.entries(f)) if (v > 900) fail(`/ @1440×900: ${k} ends at ${Math.round(v)}px, below the fold`);
  await page.screenshot({ path: `${SHOTS}/home-1440-fold.png`, timeout: 120000 });
  await page.screenshot({ path: `${SHOTS}/home-1440.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}
{
  const { ctx, page } = await open("/", 390, 844);
  const f = await page.evaluate(() => ({
    thesis: document.querySelector(".thesis").getBoundingClientRect().bottom,
    portrait: document.querySelector(".portrait").getBoundingClientRect().bottom,
  }));
  if (f.thesis > 844 || f.portrait > 844) fail(`/ @390: the thesis or portrait misses the first screen (${Math.round(f.thesis)}/${Math.round(f.portrait)})`);
  await page.screenshot({ path: `${SHOTS}/home-390-fold.png`, timeout: 120000 });
  await page.screenshot({ path: `${SHOTS}/home-390.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}
{
  const { ctx, page } = await open("/", 1024, 800);
  await page.screenshot({ path: `${SHOTS}/home-1024.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}

/* ---- 4. the portrait on the cap line and the standfirst ----------- */
for (const width of [1024, 1280, 1440, 1920]) {
  const { ctx, page } = await open("/", width);
  // The thesis is set with text-box: trim-both cap alphabetic, so its box
  // starts on the cap line of the first "I" and ends on the last baseline.
  const g = await page.evaluate(() => {
    const p = document.querySelector(".portrait").getBoundingClientRect();
    const t = document.querySelector(".thesis").getBoundingClientRect();
    const s = document.querySelector(".stand").getBoundingClientRect();
    return { pt: p.top, pb: p.bottom, cap: t.top, sb: s.bottom };
  });
  if (Math.abs(g.pt - g.cap) > 1) fail(`/ @${width}: portrait top ${Math.round(g.pt)} is not on the cap line ${Math.round(g.cap)}`);
  if (Math.abs(g.pb - g.sb) > 2) fail(`/ @${width}: portrait bottom ${Math.round(g.pb)} ≠ standfirst bottom ${Math.round(g.sb)}`);
  await ctx.close();
}

/* ---- 5. one left edge, and shared column starts ------------------- */
for (const width of [1440, 1024, 375]) {
  const { ctx, page } = await open("/", width);
  const edges = await page.evaluate(() => {
    const at = (sel) => {
      const els = [...document.querySelectorAll(sel)];
      if (!els.length) return [[sel, null]];
      return els.map((el) => [sel, Math.round(el.getBoundingClientRect().left)]);
    };
    const cols = {
      left: [".top .who", ".stand", ".sh h2", ".rt-row .c-id", ".count", ".rrow .p", ".foot .who"],
      four: [".sh .h4", ".rt-row .c-res", ".p-main", ".lrow .t", ".rrow .o", ".foot .rule-line"],
      seven: [".sh .h7", ".rt-row .c-fig", ".top nav", ".rrow .out", ".rt-foot .go"],
      ten: [".portrait", ".p-pair"],
    };
    return Object.fromEntries(Object.entries(cols).map(([k, sels]) => [k, sels.flatMap(at)]));
  });
  const groups = width >= 1024 ? ["left", "four", "seven", "ten"] : ["left"];
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
  await ctx.close();
}

/* ---- 6–8. type, colour, portrait on every route ------------------- */
for (const path of ROUTES) {
  for (const width of [1440, 390]) {
    const { ctx, page } = await open(path, width);
    const r = await page.evaluate((SIGNAL) => {
      const first = (el) => getComputedStyle(el).fontFamily.split(",")[0].trim().replace(/['"]/g, "");
      const SERIF = first(document.querySelector(".cname, .thesis, .lost h1"));
      const SANS = first(document.body);
      const out = { family: [], small: [], upper: [], tracking: [], red: [] };
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("[data-sr], .sr, .skip, svg defs, script, style")) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (ownText) {
          const fam = cs.fontFamily.split(",")[0].trim().replace(/['"]/g, "");
          if (fam !== SERIF && fam !== SANS) out.family.push(`${el.tagName}.${el.className?.baseVal ?? el.className}: ${cs.fontFamily}`);
          const size = parseFloat(cs.fontSize);
          const inFigure = !!el.closest("figure, .tw, .schem");
          if (size < 13 || (!inFigure && size < 14)) out.small.push(`${el.tagName}.${el.className} ${size}px "${el.textContent.trim().slice(0, 30)}"`);
          if (cs.textTransform === "uppercase") out.upper.push(el.className || el.tagName);
          if (parseFloat(cs.letterSpacing) > 0) out.tracking.push(el.className || el.tagName);
        }
        const paint = [cs.color, cs.backgroundColor, cs.borderTopColor, cs.borderLeftColor, cs.borderRightColor, cs.borderBottomColor, cs.outlineColor, cs.textDecorationColor, cs.backgroundImage, cs.boxShadow, cs.fill, cs.stroke].join(" ");
        const red = SIGNAL.some((c) => paint.includes(c));
        const visiblyRed =
          red &&
          (SIGNAL.some((c) => cs.color.includes(c) && ownText) ||
            SIGNAL.some((c) => cs.backgroundColor.includes(c)) ||
            (SIGNAL.some((c) => cs.borderTopColor.includes(c)) && parseFloat(cs.borderTopWidth) > 0 && !el.matches(".cs.neg")) ||
            (SIGNAL.some((c) => cs.borderRightColor.includes(c)) && parseFloat(cs.borderRightWidth) > 0) ||
            (SIGNAL.some((c) => cs.borderBottomColor.includes(c)) && parseFloat(cs.borderBottomWidth) > 0) ||
            (SIGNAL.some((c) => cs.borderLeftColor.includes(c)) && parseFloat(cs.borderLeftWidth) > 0) ||
            SIGNAL.some((c) => cs.backgroundImage.includes(c) || cs.boxShadow.includes(c)) ||
            (el instanceof SVGElement && SIGNAL.some((c) => (cs.fill + cs.stroke).includes(c))));
        if (visiblyRed && !el.closest('[data-ink="neg"]')) out.red.push(`${el.tagName}.${el.className?.baseVal ?? el.className}`);
      }
      for (const el of document.querySelectorAll("h1, h2, nav a, .go a:not(.no)")) {
        const cs = getComputedStyle(el);
        if (SIGNAL.some((c) => [cs.color, cs.backgroundColor, cs.textDecorationColor].join(" ").includes(c))) out.red.push(`heading/link ${el.tagName}.${el.className}`);
      }
      // the rule: words in the serif, measurements in the grotesk
      const voice = [];
      const must = (sel, fam, name) => {
        for (const el of document.querySelectorAll(sel)) if (first(el) !== fam) voice.push(`${sel} is not ${name}`);
      };
      must(".thesis, .s-tag, .line, .p-title, .lrow .t, .lrow .q, .lede, .cs .body > p, .statement, .cname, .ctag", SERIF, "serif");
      must(".num, .cap, .turn, .spec, .fig, .cfig, .lrow .x, .rrow .v, .sh, table.t, .go, .top", SANS, "grotesk");
      const img = document.querySelector(".portrait img");
      const portrait = img ? { filter: getComputedStyle(img).filter, loading: img.getAttribute("loading") } : null;
      const fontOk =
        /source ?serif/i.test(SERIF) && /hanken/i.test(SANS) && document.fonts.check(`16px "${SERIF}"`) && document.fonts.check(`16px "${SANS}"`);
      return { ...out, voice: [...new Set(voice)], portrait, fontOk, fams: `${SERIF} / ${SANS}` };
    }, SIGNAL);
    const cap = (a) => a.slice(0, 6).join(" | ");
    if (!r.fontOk) fail(`${path} @${width}: families "${r.fams}" are not the loaded Source Serif 4 and Hanken Grotesk`);
    if (r.family.length) fail(`${path} @${width}: a third font family: ${cap(r.family)}`);
    if (r.voice.length) fail(`${path} @${width}: ${cap(r.voice)}`);
    if (r.small.length) fail(`${path} @${width}: text below the floor: ${cap(r.small)}`);
    if (r.upper.length) fail(`${path} @${width}: uppercase transform on ${cap(r.upper)}`);
    if (r.tracking.length) fail(`${path} @${width}: positive tracking on ${cap(r.tracking)}`);
    if (r.red.length) fail(`${path} @${width}: signal red outside a said-no mark: ${cap(r.red)}`);
    if (path === "/" && r.portrait) {
      if (r.portrait.filter !== "none") fail(`/ @${width}: portrait is filtered (${r.portrait.filter})`);
      if (r.portrait.loading === "lazy") fail(`/ @${width}: portrait is lazy-loaded`);
    }
    await ctx.close();
  }
}

/* ---- 9. the ledger agrees with itself ----------------------------- */
{
  const { ctx, page } = await open("/", 1440);
  const l = await page.evaluate(() => {
    const count = Number(document.querySelector('.count .n [aria-hidden="true"]').textContent.trim());
    const rows = document.querySelectorAll(".lrow").length;
    const links = [...document.querySelectorAll(".rt-row .go .no")].map((a) => {
      const n = Number(a.textContent.trim().split(" ")[0]);
      const target = document.querySelector(a.getAttribute("href"));
      return { href: a.getAttribute("href"), n, rows: target ? target.querySelectorAll(".lrow").length : -1 };
    });
    return { count, rows, links };
  });
  if (l.count !== l.rows) fail(`/ ledger: numeral ${l.count} but ${l.rows} rows`);
  if (!l.links.length) fail("/ ledger: no \"N said no\" links found on the results rows");
  for (const k of l.links) if (k.n !== k.rows) fail(`/ ledger: "${k.n} said no" → ${k.href} has ${k.rows} rows`);
  await ctx.close();
}

/* ---- 9b. every results row carries a captioned figure --------------- */
{
  const { ctx, page } = await open("/", 1440);
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll(".rt-row")].map((r) => ({
      id: r.id,
      caption: r.querySelector(".c-fig figcaption")?.textContent.trim() ?? "",
    })),
  );
  if (rows.length !== 4) fail(`/: expected 4 results rows, found ${rows.length}`);
  for (const r of rows) if (!r.caption) fail(`/: results row ${r.id} has a figure with no caption`);
  await ctx.close();
}

/* ---- 10. case pages ----------------------------------------------- */
for (const path of ROUTES.slice(1)) {
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
  const modes = page.locator(".modes button");
  const count = await modes.count();
  if (path.startsWith("/systems/") && count !== 3) fail(`${path}: the results filter is missing (${count} buttons)`);
  if (count === 3) {
    const read = () =>
      page.evaluate(() => ({
        mode: document.getElementById("case").getAttribute("data-results"),
        held: [...document.querySelectorAll(".cs:not(.neg)")].map((s) => parseFloat(getComputedStyle(s).opacity)),
        no: [...document.querySelectorAll(".cs.neg")].map((s) => parseFloat(getComputedStyle(s).opacity)),
      }));
    await modes.nth(1).click();
    let st = await read();
    if (st.mode !== "no") fail(`${path}: "Said no" did not set data-results`);
    if (st.held.some((o) => Math.abs(o - 0.28) > 0.01)) fail(`${path}: held sections not dimmed under "Said no"`);
    if (st.no.some((o) => o !== 1)) fail(`${path}: a said-no section is dimmed under "Said no"`);
    await modes.nth(2).click();
    st = await read();
    if (st.mode !== "held") fail(`${path}: "Held" did not set data-results`);
    if (st.no.some((o) => Math.abs(o - 0.28) > 0.01)) fail(`${path}: said-no sections not dimmed under "Held"`);
  }
  const name = path.replace(/\//g, "_").replace(/^_|_$/g, "");
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true, timeout: 120000 });
  await ctx.close();
}

/* ---- 10b. a case name never runs into its tagline -------------------- */
for (const path of ROUTES.slice(1)) {
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

/* ---- 10c. the home page ships no JavaScript ----------------------- */
{
  const html = await readFile(`${OUT}/index.html`, "utf8");
  if (/<script\b/i.test(html)) fail("/: the exported home page contains a <script>");
}

/* ---- 11. hover changes no content --------------------------------- */
{
  const { ctx, page } = await open("/", 1440);
  const before = await page.evaluate(() => document.body.innerText);
  for (const sel of [".rt-row", ".lrow"]) {
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
console.log(`qa: ${ROUTES.length} routes · no overflow 360–1920 · nothing moves · first screen, cap line and shared column edges hold · serif reads, grotesk measures · red only where something said no.`);
