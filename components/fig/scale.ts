import type { Ink } from "@/lib/content";

/** Percentage string for a 0–1 fraction, clamped. */
export const pct = (f: number) => `${(Math.max(0, Math.min(1, f)) * 100).toFixed(3)}%`;

export const ink = (i?: Ink): Ink => i ?? "base";

/** A signed value as printed: a true minus sign, fixed decimals. */
export const signed = (v: number, digits = 3) =>
  `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(digits)}`;

/** Nice ticks for a linear axis: the ends and the midpoint. */
export function ticks(min: number, max: number): number[] {
  const mid = (min + max) / 2;
  return min < 0 && max > 0 && mid !== 0 ? [min, 0, max] : [min, mid, max];
}

export const fmtTick = (v: number) =>
  Number.isInteger(v) ? String(v) : v.toFixed(Math.abs(v) < 1 ? 2 : 1).replace(/0$/, "");

/** Room to the right of every track for the longest value it prints (Hanken 14/680 ≈ 8.2px a character). */
export const valueRoom = (displays: string[]) =>
  `${Math.max(60, Math.ceil(Math.max(0, ...displays.map((d) => d.length)) * 8.2 + 14))}px`;

/** The attribute that marks a said-no mark for the colour-law QA. */
export const negAttr = (i: Ink) => (i === "neg" ? { "data-ink": "neg" } : {});
