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

import { education, home, profile, publications, systems } from "./content.ts";

const facts: string[] = [];

// The opening sentence, in its two weights
facts.push(home.lead, home.leadDim);

// Work: each project's field and number; the ledger
for (const s of systems) {
  facts.push(home.fields[s.slug] ?? "", s.plain.num);
}
facts.push(home.ledger);

// What he believes
facts.push(profile.belief.doubt, profile.belief.bet);

// Papers
for (const p of publications) {
  if (!p.plain) continue;
  facts.push(p.plain.line, p.plain.num);
}

// About
facts.push(profile.lives, education.degree, education.plain);

// Contact
facts.push(home.contactLine);

/** Each string occurs exactly once in the visible text of out/index.html. */
export const homeFacts: string[] = Array.from(new Set(facts.filter((f) => f.length > 0)));

/** Strings that may occur up to this many times: chrome, not facts. */
export const allowlist: Record<string, number> = {
  // the header and the footer
  [profile.name]: 2,
  // the line over the opening sentence and the first role
  [profile.company]: 2,
  [profile.role]: 2,
  // the lab row, the education line, and the entrance test it names
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
