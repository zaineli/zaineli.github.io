import { featured, publications } from "@/lib/content";
import type { Neighbour } from "./PrevNext";

/** The write-ups a reader can walk through: the three selected systems, then the paper. */
export const RING: Neighbour[] = [
  ...featured.map((s) => ({ href: `/systems/${s.slug}/`, name: s.name })),
  ...publications.map((p) => ({ href: `/papers/${p.slug}/`, name: p.shortTitle })),
];

/** Previous and next around the ring, or null for a page that is not on it. */
export function around(href: string): { prev: Neighbour; next: Neighbour } | null {
  const i = RING.findIndex((n) => n.href === href);
  if (i === -1 || RING.length < 2) return null;
  return { prev: RING[(i - 1 + RING.length) % RING.length], next: RING[(i + 1) % RING.length] };
}
