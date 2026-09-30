/**
 * Every fact has one home. This reads the built home page, strips
 * everything a reader never sees (scripts, styles, the sr-only data
 * tables, SVG <title>s), and fails the build if any registered string
 * appears more than once — or not at all.
 *
 * It also checks that every deep link resolves (each "said no" row lands
 * on a section id of its case page, each column's "N said no" lands on a
 * ledger group), that the thesis lines join back to the manifesto, that
 * the ledger numeral is static, and that no held or banned string is
 * anywhere in the export.
 *
 * Run by `pnpm build` after `next build`. Node strips the types.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { allowlist, bannedPatterns, bannedStrings, heldStrings, homeFacts } from "../lib/facts.ts";
import { negativeCount, profile, publications, SPEC_DECODE_HOLD, shownLedger, shownSections, systems } from "../lib/content.ts";
import { slugify } from "../lib/slug.ts";

const OUT = "out";

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<title>[\s\S]*?<\/title>/gi, " ")
    // sr-only tables and any other data-sr element
    .replace(/<(\w+)[^>]*\sdata-sr[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ");
}

const numericBoundary = (needle: string, before: string, after: string) =>
  !/^[−+~]?[\d.]/.test(needle) || (!/[\d.,%×]/.test(before) && !/[\d.,%×]/.test(after));

/** Occurrences of `needle`, refusing a match that is part of a longer number. */
function count(haystack: string, needle: string): number {
  let n = 0;
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    if (numericBoundary(needle, haystack[i - 1] ?? " ", haystack[i + needle.length] ?? " ")) n++;
    i = haystack.indexOf(needle, i + needle.length);
  }
  return n;
}

/**
 * Longer facts own their digits: "recall 0.000 through 3,000 steps" is one
 * fact, so the "0.000" inside it is not a second sighting of whetstone's
 * held-out stub. Matching longest-first and consuming each match keeps
 * every fact accountable exactly once.
 */
function consume(text: string, needle: string): { text: string; found: number } {
  let out = "";
  let rest = text;
  let found = 0;
  for (;;) {
    const i = rest.indexOf(needle);
    if (i === -1) break;
    const ok = numericBoundary(needle, rest[i - 1] ?? " ", rest[i + needle.length] ?? " ");
    if (ok) found++;
    out += rest.slice(0, i) + (ok ? "\u0000" : needle);
    rest = rest.slice(i + needle.length);
  }
  return { text: out + rest, found };
}

const failures: string[] = [];

const homePath = `${OUT}/index.html`;
if (!existsSync(homePath)) {
  console.error(`check-once: ${homePath} is missing — did next build export?`);
  process.exit(1);
}
const homeHtml = readFileSync(homePath, "utf8");
const home = visibleText(homeHtml);

// 1. one home per fact
let rest = home;
for (const fact of [...homeFacts].sort((a, b) => b.length - a.length)) {
  const { text, found } = consume(rest, fact);
  rest = text;
  if (found !== 1) failures.push(`${found}× "${fact}" (want 1)`);
}
for (const [phrase, allowed] of Object.entries(allowlist)) {
  const n = count(home, phrase);
  if (n > allowed) failures.push(`${n}× "${phrase}" (allowed ${allowed})`);
}

// 2. the thesis lines are the manifesto, and the numeral is static
if (profile.manifestoLines.join(" ") !== profile.manifesto) {
  failures.push("profile.manifestoLines do not join back to profile.manifesto");
}
if (!homeHtml.includes(`data-sr="">${negativeCount} negative results<`)) {
  failures.push(`the ledger numeral ${negativeCount} is not static in the home page, or its screen-reader text is missing`);
}
if (/<script\b/i.test(homeHtml)) failures.push("the home page ships a <script> (strip-js did not run?)");

// 3. every deep link lands on something
const needId = (page: string, id: string, what: string) => {
  if (!existsSync(page)) return failures.push(`missing page ${page} (${what})`);
  if (!readFileSync(page, "utf8").includes(`id="${id}"`)) failures.push(`${page} has no #${id} (${what})`);
};
for (const s of systems) {
  const page = `${OUT}/systems/${s.slug}/index.html`;
  const ids = new Set(shownSections(s).map((x) => slugify(x.heading)));
  for (const e of shownLedger(s.ledger)) {
    if (!ids.has(e.anchor)) failures.push(`${s.slug} ledger "${e.term}" points at a hidden or missing section #${e.anchor}`);
    needId(page, e.anchor, `ledger "${e.term}"`);
  }
  if (shownLedger(s.ledger).length) needId(homePath, `no-${s.slug}`, `${s.slug} "said no" link`);
  for (const section of s.sections) if (!slugify(section.heading)) failures.push(`${s.slug}: empty slug for "${section.heading}"`);
}
for (const p of publications) {
  for (const e of shownLedger(p.ledger ?? [])) needId(`${OUT}/papers/${p.slug}/index.html`, e.anchor, `ledger "${e.term}"`);
}

// 4. held and banned strings appear nowhere in the export — not in visible
// text, and not in a <title>, a meta/og tag, an aria-label, an sr-only table
// or the RSC payload: the raw .html and .txt files are scanned, entities
// decoded.
const allFiles: string[] = [];
const walk = (dir: string) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else allFiles.push(p);
  }
};
walk(OUT);
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));
const textFiles = allFiles.filter((f) => /\.(html|txt)$/.test(f) && !f.includes(`${OUT}/_next/`));
const decode = (t: string) =>
  t.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
for (const file of textFiles) {
  const raw = decode(readFileSync(file, "utf8"));
  const lower = raw.toLowerCase();
  if (SPEC_DECODE_HOLD) for (const s of heldStrings) if (raw.includes(s)) failures.push(`${file} contains held "${s}"`);
  for (const s of bannedStrings) if (lower.includes(s.toLowerCase())) failures.push(`${file} contains banned "${s}"`);
  for (const re of bannedPatterns) if (re.test(raw)) failures.push(`${file} matches banned ${re}`);
}

// 5. nothing is published that no page uses: every exported file outside
// _next/ must be referenced by some page (or be site plumbing).
const PLUMBING = /(^|\/)(CNAME|\.nojekyll|icon\.svg|opengraph-image\.png|404\.html|index\.html|index\.txt|[^/]+\.txt)$/;
const pages = htmlFiles.map((f) => readFileSync(f, "utf8")).join("\n");
for (const file of allFiles) {
  const rel = file.slice(OUT.length + 1);
  if (rel.startsWith("_next/") || PLUMBING.test(rel)) continue;
  if (!pages.includes(`/${rel}`)) failures.push(`out/${rel} is published but no page references it`);
}

if (failures.length) {
  console.error(`\ncheck-once: ${failures.length} problem(s) in the built site\n`);
  for (const f of failures) console.error(`  · ${f}`);
  console.error("");
  process.exit(1);
}
console.log(
  `check-once: ${homeFacts.length} facts, each exactly once; every deep link resolves; ${textFiles.length} pages and payloads free of held and banned strings; every published file is used.`,
);
