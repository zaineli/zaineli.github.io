import type { CSSProperties } from "react";
import type { FigureSpec } from "@/lib/content";
import { ink, negAttr, pct, valueRoom } from "./scale";

/**
 * Before → after, one group per pair: the baseline in grey, the other side
 * in its own ink, each value printed at its bar end, the ratio beside the
 * group name. One scale per pair unless the spec shares one.
 */
export default function Pairs({ spec }: { spec: FigureSpec & { kind: "pairs" } }) {
  const shared = spec.sharedScale ? Math.max(...spec.pairs.flatMap((p) => [p.a.value, p.b.value])) : null;

  const room = valueRoom(spec.pairs.flatMap((p) => [p.a.display, p.b.display]));
  return (
    <div className="bars" aria-hidden="true" style={{ "--vr": room } as CSSProperties}>
      {spec.pairs.map((pair) => {
        const max = shared ?? Math.max(pair.a.value, pair.b.value);
        const tone = ink(pair.b.ink);
        return (
          <div key={pair.label} className="bars">
            <p className="grp">
              {pair.label}
              {pair.ratio ? <span className="ratio">{pair.ratio}</span> : null}
            </p>
            {[
              { side: pair.a, t: "base" as const },
              { side: pair.b, t: tone },
            ].map(({ side, t }) => (
              <div key={side.label} className="bar">
                <span className="k">{side.label}</span>
                <div className="trk" style={{ "--w": pct(side.value / max) } as CSSProperties}>
                  <i className={`i-${t}`} {...negAttr(t)} />
                  <span className="v">{side.display}</span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
