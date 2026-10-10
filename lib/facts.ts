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

import { education, experience, negativeCount, profile, publications, systems } from "./content.ts";

const facts: string[] = [];

// The hero
facts.push(...profile.headline, profile.lede, profile.now);

// Projects: each card's line, result and caption
facts.push(profile.projectsIntro);
for (const s of systems) {
  facts.push(s.plain.line, s.plain.num, s.plain.cap);
  if (s.plain.vs) facts.push(s.plain.vs);
}

// The paper card
for (const p of publications) {
  if (!p.plain) continue;
  facts.push(p.plain.line, p.plain.with, p.plain.num, p.plain.vs, p.plain.cap);
}

// Experience and education, one line each
for (const r of experience) facts.push(r.plain);
facts.push(education.degree, education.plain);

// How I work
facts.push(profile.belief.doubt, profile.belief.bet, ...profile.principles, `See all ${negativeCount}`);

/** Each string occurs exactly once in the visible text of out/index.html. */
export const homeFacts: string[] = Array.from(new Set(facts.filter((f) => f.length > 0)));

/** Strings that may occur up to this many times: chrome, not facts. */
export const allowlist: Record<string, number> = {
  // the header and the footer
  [profile.name]: 2,
  // the header, the "now" line and the first experience row
  [profile.company]: 3,
  // the header and the first experience row
  [profile.role]: 2,
  // an affiliation-free page: the lab row and the education row
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
