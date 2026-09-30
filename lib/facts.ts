/* ------------------------------------------------------------------ *
 * Fact registry. Every string here must occur exactly once in the
 * visible text of the built home page; scripts/check-once.ts enforces
 * it over out/index.html. Nothing is written by hand: each entry is
 * derived from lib/content.ts, so a fact cannot be registered that the
 * content does not hold. Held entries (SPEC_DECODE_HOLD) are excluded
 * here and asserted absent by check-once.
 *
 * Imported with the .ts extension so Node can load it natively.
 * ------------------------------------------------------------------ */

import {
  education,
  experience,
  listings,
  negativeCount,
  profile,
  publications,
  shownLedger,
  shownTagline,
  systems,
  type FigureSpec,
} from "./content.ts";

/** A signed value as the figures print it (components/fig/scale.ts). */
const signed = (v: number, digits = 3) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(digits)}`;

/** The printed values of one home figure: what the reader sees at bar ends. */
const figureFacts = (fig: FigureSpec): string[] => {
  switch (fig.kind) {
    case "bars":
      return fig.bars.filter((b) => !b.hideValue).map((b) => b.display ?? String(b.value));
    case "dots":
      return fig.points.map((p) => signed(p.value));
    case "pairs":
      return fig.pairs.flatMap((p) => [p.a.display, p.b.display, ...(p.ratio ? [p.ratio] : [])]);
    case "diverging":
      return fig.series.map((s) => s.display ?? String(s.primary));
    case "lines":
      return [];
  }
};

const facts: string[] = [];

// The masthead and the title block
facts.push(profile.role, profile.manifesto, profile.method, profile.lives);

// Systems: each row's tagline, field, number, caption, figure values, line and conditions
for (const s of systems) {
  facts.push(shownTagline(s), s.thread, s.lead.value, s.lead.label, s.homeLine, s.spec);
  if (s.lead.after) facts.push(s.lead.after);
  facts.push(...figureFacts(s.homeFigure));
}

// Papers listed by title only while their manuscript is not public
for (const l of listings) facts.push(l.title, l.subtitle, l.status);

// The paper: title, the split sentence, the pair, the status line
for (const p of publications) {
  facts.push(p.title, p.status);
  if (p.claim) facts.push(p.claim.lead, p.claim.rest);
  if (p.limit) facts.push(p.limit);
  const pairs = p.figures.find((f) => f.kind === "pairs");
  if (pairs && pairs.kind === "pairs") {
    const last = pairs.pairs[pairs.pairs.length - 1];
    facts.push(String(last.a.value), String(last.b.value));
  }
}

// What said no: the line, the count, every shown number and quote
facts.push(profile.ledgerLine, String(negativeCount));
for (const e of [...systems.flatMap((s) => shownLedger(s.ledger)), ...publications.flatMap((p) => shownLedger(p.ledger ?? []))]) {
  facts.push(e.term);
  if (e.number) facts.push(e.number);
  if (e.quote) facts.push(e.quote.replace(/^“|”$/g, ""));
}

// The record: one number (or his gloss) per role
facts.push(education.degree);
for (const role of experience) {
  if (role.gloss) facts.push(role.gloss);
  if (role.glossLine) facts.push(role.glossLine);
  const o = role.outcomes[0];
  if (o?.value) facts.push(o.value, o.label);
}

// The foot
facts.push(profile.discipline);

/** Each string occurs exactly once in the visible text of out/index.html. */
export const homeFacts: string[] = Array.from(new Set(facts.filter((f) => f.length > 0)));

/** Strings that may occur up to this many times: chrome, not facts. */
export const allowlist: Record<string, number> = {
  // the masthead, the paper's author line, the footer
  [profile.name]: 3,
  // the masthead's role line and the first record row
  [profile.company]: 2,
  // the paper's affiliation, the record row, the entry-test prior
  NUST: 3,
};

/** Strings that must not appear anywhere in the export while their result is held. */
export const heldStrings: string[] = [
  "Speculative decoding, slower",
  "1.92×",
  "cannot pay at any",
  "9× cheaper",
  "did not pay",
  "lossless speculative decoding",
];

/** Strings that must never appear on any page, in any form (checked case-insensitively over raw HTML and RSC payloads). */
export const bannedStrings: string[] = [
  "under review",
  "Stanford collaborators",
  "Internet of Evolving Agents",
  "Internet of Agents",
  "alexein.ai",
  "33K identities",
  "SynapseGraph",
  "distributed-ml-platform",
  "4.2M patient",
  "Amazon-partnered",
  "ρ = 0.83",
  "d = 1.42",
  "+0.24",
];

/** Whole-word bans (a regex, so "IoA" does not match inside another word). */
export const bannedPatterns: RegExp[] = [/\bIoA\b/, /\bTAM\b/, /\bpatent(ed)?\b/i, /US 12001073/];
