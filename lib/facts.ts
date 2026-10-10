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
  priors,
  profile,
  publications,
  rules,
  rulesLine,
  systems,
} from "./content.ts";

const facts: string[] = [];

// The masthead and the opening
facts.push(...profile.opening, profile.openingWord, profile.lives);
facts.push(profile.building, profile.manifesto, profile.bet);

// Work: each row's field, question, number, caption, turn and what said no
facts.push(profile.workLine);
for (const s of systems) {
  facts.push(s.thread, s.question, s.lead.value, s.lead.label, s.no);
  if (s.lead.after) facts.push(s.lead.after);
}

// How he works: the line, every rule, and the tally
facts.push(rulesLine, ...rules.map((r) => r.text));
facts.push(String(negativeCount), "results on this site said no. Each is listed with what said it.");

// Papers listed by title only while their manuscript is not public
for (const l of listings) facts.push(l.title, l.subtitle, l.status);

// The paper: title, status, and the pair
for (const p of publications) {
  facts.push(p.title, p.status);
  const pairs = p.figures.find((f) => f.kind === "pairs");
  if (pairs && pairs.kind === "pairs") {
    const last = pairs.pairs[pairs.pairs.length - 1];
    facts.push(String(last.a.value), String(last.b.value));
  }
}

// The record: one number (or his gloss) per role, the degree and the ranks
facts.push(education.degree);
for (const role of experience) {
  const o = role.outcomes[0];
  if (o?.value) facts.push(o.value, o.label);
}
for (const p of priors.filter((x) => x.home)) facts.push(p.rank);

// Contact and the foot
facts.push(profile.closer, profile.aside);

/** Each string occurs exactly once in the visible text of out/index.html. */
export const homeFacts: string[] = Array.from(new Set(facts.filter((f) => f.length > 0)));

/** Strings that may occur up to this many times: chrome, not facts. */
export const allowlist: Record<string, number> = {
  // the masthead, the paper's author line, the portrait's alt, the footer
  [profile.name]: 3,
  // the masthead's role line and the first record row
  [profile.company]: 2,
  [profile.role]: 2,
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
