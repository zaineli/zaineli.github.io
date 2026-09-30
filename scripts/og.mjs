/**
 * The social card: the real title block — thesis, portrait, the two standing
 * sentences — captured from the built site, so what a link preview shows is
 * what the page is. Serves out/ itself; run after `pnpm build`.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const OUT = "out";
const PORT = 4401;
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const p = normalize(url.endsWith("/") ? join(OUT, url, "index.html") : join(OUT, url));
  if (!p.startsWith(OUT) || !existsSync(p)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
  res.end(await readFile(p));
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 700 }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
// The sheet at 1200 wide, margins included, down to just under the title block.
const box = await page.evaluate(() => {
  const t = document.querySelector(".thesis").getBoundingClientRect();
  const s = document.querySelector(".stand").getBoundingClientRect();
  const p = document.querySelector(".portrait").getBoundingClientRect();
  return { top: t.top, bottom: Math.max(s.bottom, p.bottom) };
});
const y = Math.max(0, Math.round(box.bottom + 28 - 630));
await page.screenshot({ path: "app/opengraph-image.png", clip: { x: 0, y, width: 1200, height: 630 } });
await browser.close();
server.close();
console.log(`og: app/opengraph-image.png written (1200×630 from y=${y})`);
