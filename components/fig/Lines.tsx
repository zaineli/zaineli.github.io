import type { FigureSpec } from "@/lib/content";
import { fmtTick, ink } from "./scale";

/* Two SVGs, one box. The outer one is sized by CSS (full width, 240px) and
   carries the text at its true 13px, positioned in percentages; the inner
   one draws the marks in a 1000-unit coordinate space stretched to the box
   with non-scaling strokes. So the figure has the same geometry on the
   server, on a phone and in print, and needs no JavaScript to measure it. */
const H = 240;
const TOP = 12;
const BOTTOM = 210;
const W = 1000;
const PLOT_L = 5; // % of the width: room for the y ticks
const PLOT_R = 80; // %: the right 20% carries the end labels

/**
 * Series against a horizon. Each series is named at its own end point — no
 * legend. A dashed reference (a ceiling, a break-even) and a hatched region
 * between it and the measurement carry the finding: the gap is the point,
 * so the gap is the shape. Complete on first paint.
 */
export default function Lines({ spec }: { spec: FigureSpec & { kind: "lines" } }) {
  const xMin = spec.x[0];
  const xMax = spec.x[spec.x.length - 1];
  const pxPct = (v: number) => PLOT_L + ((v - xMin) / (xMax - xMin)) * (PLOT_R - PLOT_L);
  const ux = (v: number) => (pxPct(v) / 100) * W;
  const py = (v: number) => BOTTOM - ((v - spec.yMin) / (spec.yMax - spec.yMin)) * (BOTTOM - TOP);
  const yTicks = [0, 1, 2, 3].map((k) => spec.yMin + (k * (spec.yMax - spec.yMin)) / 3);
  const first = spec.series[0];
  const pts = (values: number[]) => values.map((v, i) => `${ux(spec.x[i]).toFixed(1)},${py(v).toFixed(1)}`).join(" ");

  let shade: string | null = null;
  if (spec.shade && spec.reference && first) {
    const back = first.points.map((v, i) => `${ux(spec.x[i]).toFixed(1)},${py(v).toFixed(1)}`).reverse().join(" ");
    shade = `${ux(xMin)},${py(spec.reference.value)} ${ux(xMax)},${py(spec.reference.value)} ${back}`;
  }

  // End labels: nudge apart when two series end within 16px of each other.
  const ends = spec.series.map((s) => ({ s, y: py(s.points[s.points.length - 1]) }));
  ends.sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 16) ends[i].y = ends[i - 1].y + 16;
  const endY = new Map(ends.map((e) => [e.s.label, e.y]));
  const patternId = `h-${spec.id}`;
  const endX = `${PLOT_R}%`; // with dx = 6 on every end label

  return (
    <svg className="lines" width="100%" height={H} role="img" aria-label={spec.title}>
      <svg x="0" y="0" width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id={patternId} width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
            <rect width="1.6" height="4.6" fill="var(--signal)" />
          </pattern>
        </defs>
        {shade ? <polygon points={shade} fill={`url(#${patternId})`} opacity={0.38} data-ink="neg" /> : null}
        {yTicks.map((t) => (
          <line key={t} x1={ux(xMin)} x2={ux(xMax)} y1={py(t)} y2={py(t)} stroke="var(--rule)" vectorEffect="non-scaling-stroke" />
        ))}
        {spec.reference ? (
          <line
            x1={ux(xMin)}
            x2={ux(xMax)}
            y1={py(spec.reference.value)}
            y2={py(spec.reference.value)}
            stroke="var(--ink)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
        {spec.series.map((s) => {
          const tone = ink(s.ink);
          const stroke = tone === "neg" ? "var(--signal)" : tone === "claim" ? "var(--ink)" : "var(--base)";
          return (
            <polyline
              key={s.label}
              fill="none"
              stroke={stroke}
              strokeWidth={2}
              strokeDasharray={tone === "neg" ? "5 3" : undefined}
              vectorEffect="non-scaling-stroke"
              points={pts(s.points)}
              {...(tone === "neg" ? { "data-ink": "neg" } : {})}
            />
          );
        })}
        <line x1={ux(xMin)} x2={ux(xMax)} y1={BOTTOM} y2={BOTTOM} stroke="var(--ink)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Dots and text live in the outer SVG so they keep their shape. */}
      {spec.series.map((s) =>
        ink(s.ink) === "neg"
          ? s.points.map((v, i) => (
              <circle
                key={`${s.label}-${spec.x[i]}`}
                cx={`${pxPct(spec.x[i])}%`}
                cy={py(v)}
                r={3.5}
                fill="var(--ground)"
                stroke="var(--signal)"
                strokeWidth={1.5}
                data-ink="neg"
              />
            ))
          : null,
      )}
      {spec.marker ? (
        <circle cx={`${pxPct(spec.marker.x)}%`} cy={py(spec.marker.y)} r={4.5} fill="var(--ground)" stroke="var(--ink)" strokeWidth={1.5} />
      ) : null}

      <g aria-hidden="true">
        {yTicks.map((t) => (
          <text key={t} x={`${PLOT_L}%`} dx={-8} y={py(t) + 4} textAnchor="end">
            {fmtTick(t)}
          </text>
        ))}
        {spec.x.map((v) => (
          <text key={v} x={`${pxPct(v)}%`} y={BOTTOM + 22} textAnchor="middle">
            {v}
          </text>
        ))}
        {spec.xLabel ? (
          <text x={endX} dx={6} y={BOTTOM + 22}>
            {spec.xLabel}
          </text>
        ) : null}
        {spec.reference ? (
          <text className="strong" x={endX} dx={6} y={py(spec.reference.value) + 4}>
            {spec.reference.label}
          </text>
        ) : null}
        {spec.shadeLabel && shade && spec.reference ? (
          <text className="neg" x={`${PLOT_L}%`} dx={8} y={py(spec.reference.value) + (spec.shade === "below-reference" ? 18 : -8)} data-ink="neg">
            {spec.shadeLabel}
          </text>
        ) : null}
        {spec.series.map((s) => (
          <text
            key={s.label}
            className={ink(s.ink) === "neg" ? "neg" : undefined}
            x={endX}
            dx={6}
            y={(endY.get(s.label) ?? 0) + 4}
            {...(ink(s.ink) === "neg" ? { "data-ink": "neg" } : {})}
          >
            {s.label}
          </text>
        ))}
        {spec.marker ? (
          <text className="strong" x={`${pxPct(spec.marker.x)}%`} dx={9} y={py(spec.marker.y) - 9}>
            {spec.marker.label}
          </text>
        ) : null}
      </g>
    </svg>
  );
}
