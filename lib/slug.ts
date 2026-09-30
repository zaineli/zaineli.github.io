/**
 * Heading → id. Shared by case-section ids, ledger anchors and method hrefs,
 * so a deep link and the section it lands on cannot disagree.
 * Lowercase, punctuation stripped, spaces → hyphens: "Two hypotheses, both refuted"
 * → "two-hypotheses-both-refuted".
 */
export const slugify = (heading: string): string =>
  heading
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
