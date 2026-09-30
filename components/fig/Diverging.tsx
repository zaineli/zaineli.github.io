import type { CSSProperties } from "react";
import type { FigureSpec } from "@/lib/content";
import { ink, negAttr, pct } from "./scale";

/**
 * Signed bars either side of a zero axis, with the second measurement as a
 * tick on the same row — the whole ablation table in one figure. The
 * printed value is the bar's; the tick's value lives in the table below.
 */
export default function Diverging({ spec }: { spec: FigureSpec & { kind: "diverging" } }) {
  const span = spec.max - spec.min;
  const at = (v: number) => (v - spec.min) / span;
  const zero = at(0);

  return (
    <div className="bars" aria-hidden="true" style={{ "--z": pct(zero) } as CSSProperties}>
      {spec.series.map((s) => {
        const tone = ink(s.ink);
        const x = at(s.primary);
        const display = s.display ?? (s.primary > 0 ? `+${s.primary}` : s.primary < 0 ? `−${Math.abs(s.primary)}` : "0");
        return (
          <div key={s.label} className="bar">
            <span className="k">{s.label}</span>
            <div
              className="dtrk"
              style={
                {
                  "--a": pct(Math.min(x, zero)),
                  "--w": pct(Math.abs(x - zero)),
                  ...(s.secondary != null ? { "--s": pct(at(s.secondary)) } : {}),
                } as CSSProperties
              }
            >
              <span className="z" />
              <i className={`i-${tone === "base" ? "claim" : tone}`} {...negAttr(tone)} />
              {s.secondary != null ? <span className="tick" /> : null}
              <span className="v">{display}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
