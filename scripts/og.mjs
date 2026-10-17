/**
 * The social card: the real first screen — the first frame and Fig. 0, the
 * ceramic knot — captured from the built site, so what a link preview shows
 * is what the page is. Reduced motion makes the frame the same every run.
 * Serves out/ itself; run after `pnpm build`.
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

const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM, args: GL } : { args: GL });
// The first screen at the card's own size: the layout fits the model into it.
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(4000);
await page.screenshot({ path: "app/opengraph-image.png" });
await browser.close();
server.close();
console.log("og: app/opengraph-image.png written (1200×630)");
