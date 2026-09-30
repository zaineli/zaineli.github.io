import type { CSSProperties } from "react";
import type { FigureSpec } from "@/lib/content";
import { signed } from "./scale";

/**
 * The random → oracle gap as one band. The bracket's two points are the
 * ends; the third point is where the learned model got to, and the part of
 * the band it closed is hatched red — the hatch is the whole result, so it
 * is the only mark with colour. Every value is printed.
 */
export default function Dots({ spec }: { spec: FigureSpec & { kind: "dots" } }) {
  const from = spec.bracket ? spec.points.find((p) => p.label === spec.bracket!.from) : spec.points[0];
  const to = spec.bracket
    ? spec.points.find((p) => p.label === spec.bracket!.to)
    : spec.points[spec.points.length - 1];
  const mid = spec.points.find((p) => p !== from && p !== to);
  if (!from || !to || !mid) return null;

  const closed = (mid.value - from.value) / (to.value - from.value);
  const l = `${(closed * 100).toFixed(2)}%`;
  const label = `${from.label} ${signed(from.value)}, ${mid.label} ${signed(mid.value)}, ${to.label} ${signed(to.value)}`;

  return (
    <div style={{ "--l": l } as CSSProperties}>
      <div className="lab-up" aria-hidden="true">
        <span data-ink="neg">
          {mid.label} <b>{signed(mid.value)}</b>
        </span>
      </div>
      <div className="gap" role="img" aria-label={label}>
        <i className="closed" data-ink="neg" />
        <i className="t r" />
        <i className="t l" data-ink="neg" />
        <i className="t o" />
        {spec.bracket ? <span className="word">{spec.bracket.label}</span> : null}
      </div>
      <p className="ends" aria-hidden="true">
        <span>
          {from.label} <b>{signed(from.value)}</b>
        </span>
        <span>
          {to.label} <b>{signed(to.value)}</b>
        </span>
      </p>
    </div>
  );
}
