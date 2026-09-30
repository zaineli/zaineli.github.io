import type { CSSProperties, ReactNode } from "react";
import type { FigureSpec } from "@/lib/content";
import { ink, negAttr, pct, valueRoom } from "./scale";

/**
 * Horizontal bars in pixel space. The label sits above its bar, the value
 * 8px past the bar end. Solid ink is a claim that held, grey is a baseline
 * or control, red hatch is a result that said no, and a zero is a 3px
 * stub — never a band. One scale per figure.
 */
export default function Bars({ spec }: { spec: FigureSpec & { kind: "bars" } }) {
  const rows: ReactNode[] = [];
  let group: string | undefined;

  spec.bars.forEach((bar, i) => {
    if (bar.group && bar.group !== group) {
      rows.push(
        <p key={`g-${bar.group}`} className="grp">
          {bar.group}
        </p>,
      );
      group = bar.group;
    }
    const tone = ink(bar.ink);
    const display = bar.display ?? String(bar.value);
    const width = bar.stub ? "3px" : pct(bar.value / spec.max);
    rows.push(
      <div key={`${bar.label}-${i}`} className="bar">
        <span className="k">{bar.label}</span>
        <div className="trk" style={{ "--w": width } as CSSProperties}>
          <i className={bar.stub ? "i-stub" : `i-${tone}`} {...negAttr(tone)} />
          {spec.reference ? <i className="ref" /> : null}
          {bar.hideValue ? null : <span className="v">{display}</span>}
        </div>
      </div>,
    );
  });

  const room = valueRoom(spec.bars.filter((b) => !b.hideValue).map((b) => b.display ?? String(b.value)));
  return (
    <div
      className="bars"
      aria-hidden="true"
      style={
        {
          "--vr": room,
          ...(spec.reference ? { "--r": pct(spec.reference.value / spec.max) } : {}),
        } as CSSProperties
      }
    >
      {rows}
      {spec.reference ? (
        <div className="reflab">
          <span>{spec.reference.label}</span>
        </div>
      ) : null}
    </div>
  );
}
