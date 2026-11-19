/**
 * What he has written on alexein.ai, newest first: each post's own title
 * (its h1 there, word for word), its address and the date it was published.
 * The home page lists them under "Writing at Alexein", so a search engine
 * can join his page to the posts and the posts back to him. Only posts that
 * are live go here; add one when it is published, never before.
 *
 * Kept out of lib/content.ts so it can change on its own.
 */

export interface Post {
  title: string;
  href: string;
  /** ISO date, as the post's own structured data gives it. */
  date: string;
}

export const writing: Post[] = [
  {
    title: "45% cheaper than Claude’s own connectors",
    href: "https://alexein.ai/blog/claude-connectors-vs-alexein",
    date: "2026-11-18",
  },
  {
    title: "Right the first time: Claude Code with and without Alexein",
    href: "https://alexein.ai/blog/coding-agent-team-knowledge",
    date: "2026-11-17",
  },
  {
    title: "We repeated Mem0’s “97% smaller” Claude Code test",
    href: "https://alexein.ai/blog/repeating-mem0-claude-code-test",
    date: "2026-11-17",
  },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-11-18" → "18 November 2026", the same on every machine (no locale, no time zone). */
export const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
