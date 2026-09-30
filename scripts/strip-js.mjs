/**
 * The home page and the 404 have no client component and every link is a
 * plain <a>, so they ship no JavaScript at all: this removes the framework
 * runtime, the RSC payload and the script preloads from their exported
 * HTML. Case pages keep theirs (the results filter and Copy BibTeX).
 * Run by `pnpm build` after `next build`.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const PAGES = ["out/index.html", "out/404.html", "out/404/index.html"];
let stripped = 0;
for (const page of PAGES) {
  if (!existsSync(page)) continue;
  const before = readFileSync(page, "utf8");
  const after = before
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*as="script"[^>]*\/?>/gi, "")
    .replace(/<link\b[^>]*as="script"[^>]*rel="(?:preload|modulepreload)"[^>]*\/?>/gi, "");
  writeFileSync(page, after);
  stripped += (before.match(/<script\b/gi) ?? []).length;
}
console.log(`strip-js: removed ${stripped} script tag(s) from ${PAGES.filter(existsSync).length} static page(s).`);
