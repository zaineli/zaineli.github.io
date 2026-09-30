import type { CSSProperties } from "react";
import {
  SPEC_DECODE_HOLD,
  type Schematic as SchematicSpec,
  type SchematicEdge,
  type SchematicNode,
} from "@/lib/content";
import KeepHyphens from "@/components/KeepHyphens";

/**
 * A mechanism diagram from the node/edge lists in lib/content.ts (a 24 × 8
 * unit grid). The edges are one SVG stretched to the box, drawn centre to
 * centre with non-scaling strokes; the nodes are real HTML boxes laid over
 * them, so a label is set in the page's own type at 13px and can never be
 * squashed or measured wrong. A node's ground-coloured fill hides the edge
 * behind it. Refuted components are hatched red; hypotheses, oracles and
 * references are dashed.
 *
 * Below 880px the drawing becomes a list read in edge order — each row a
 * chain of components joined by arrows, the edge labels beneath — and that
 * list is the screen-reader copy at every width.
 */
const UX = 100; // viewBox units per grid unit
const H_PX = 300; // the drawing's height at every width it is drawn
const UY_PX = H_PX / 8;

const nodeW = (n: SchematicNode) => n.w ?? 3;

function edgePoints(e: SchematicEdge, byId: Map<string, SchematicNode>): [number, number][] {
  const a = byId.get(e.from);
  const b = byId.get(e.to);
  if (!a || !b) return [];
  return [[a.x, a.y], ...(e.via ?? []), [b.x, b.y]];
}

/** Where an edge's label goes: the middle of its longest segment. */
function labelAt(pts: [number, number][]): { x: number; y: number; vertical: boolean } {
  let best = 1;
  let bestLen = -1;
  for (let i = 1; i < pts.length; i++) {
    const len = Math.hypot(pts[i][0] - pts[i - 1][0], (pts[i][1] - pts[i - 1][1]) * 3);
    if (len > bestLen) {
      bestLen = len;
      best = i;
    }
  }
  const [x1, y1] = pts[best - 1];
  const [x2, y2] = pts[best];
  const vertical = Math.abs(x2 - x1) < 0.01;
  // A vertical label sits nearer the upper end, clear of the labels that
  // ride above the node row below it.
  const top = Math.min(y1, y2);
  return { x: (x1 + x2) / 2, y: vertical ? top + Math.abs(y2 - y1) * 0.4 : (y1 + y2) / 2, vertical };
}

/** The diagram as rows: follow solid edges from each unvisited node, so the list reads as the mechanism does. */
function chains(nodes: SchematicNode[], edges: SchematicEdge[]) {
  const visited = new Set<string>();
  const rows: { ids: string[]; labels: string[] }[] = [];
  for (const node of nodes) {
    if (visited.has(node.id)) continue;
    const from = edges.find((e) => e.to === node.id && visited.has(e.from));
    const ids = from ? [from.from] : [];
    const labels = from?.label ? [from.label] : [];
    let cur = node.id;
    for (;;) {
      ids.push(cur);
      visited.add(cur);
      const next = edges.find((e) => e.from === cur && !e.dashed && !visited.has(e.to));
      if (!next) {
        const end = edges.find((e) => e.from === cur && !e.dashed && visited.has(e.to) && !ids.includes(e.to));
        if (end) {
          ids.push(end.to);
          if (end.label) labels.push(end.label);
        }
        break;
      }
      if (next.label) labels.push(next.label);
      cur = next.to;
    }
    rows.push({ ids, labels });
  }
  return rows;
}

export default function Schematic({ schematic, label }: { schematic: SchematicSpec; label: string }) {
  const nodes = schematic.nodes.filter((n) => !(SPEC_DECODE_HOLD && n.hold));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const shownEdges = schematic.edges.filter((e) => byId.has(e.from) && byId.has(e.to));
  const edges = shownEdges.map((e) => ({ e, pts: edgePoints(e, byId) })).filter((x) => x.pts.length > 1);
  const rows = chains(nodes, shownEdges);

  return (
    <figure className="schem" aria-label={`${label} mechanism`}>
      <div className="schem-draw" aria-hidden="true">
        <svg viewBox={`0 0 ${24 * UX} ${8 * UX}`} preserveAspectRatio="none">
          {edges.map(({ e, pts }, i) => (
            <polyline
              key={`${e.from}-${e.to}-${i}`}
              points={pts.map(([x, y]) => `${x * UX},${y * UX}`).join(" ")}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              strokeDasharray={e.dashed ? "5 4" : undefined}
            />
          ))}
        </svg>

        {edges
          .filter(({ e }) => e.label)
          .map(({ e, pts }, i) => {
            const at = labelAt(pts);
            // An authored position wins. A routing line with no node on its
            // row carries the label on the line itself; a horizontal edge
            // between nodes carries it above the node row, clear of the
            // boxes; a vertical one carries it to the right of the line.
            const onRow = nodes.some((n) => Math.abs(n.y - at.y) < 0.6);
            const style: CSSProperties = e.labelAt
              ? { left: `${(e.labelAt[0] / 24) * 100}%`, top: e.labelAt[1] * UY_PX, transform: "translate(-50%, -50%)" }
              : at.vertical
                ? { left: `${(at.x / 24) * 100}%`, top: at.y * UY_PX, transform: "translate(8px, -50%)" }
                : !onRow
                  ? { left: `${(at.x / 24) * 100}%`, top: at.y * UY_PX, transform: "translate(-50%, -50%)" }
                  : { left: `${(at.x / 24) * 100}%`, top: at.y * UY_PX, transform: "translate(-50%, calc(-100% - 26px))" };
            return (
              <span key={`l-${i}`} className="el" style={style}>
                {e.label}
              </span>
            );
          })}

        {nodes.map((n) => {
          const w = nodeW(n);
          const cls = ["sn", n.kind === "store" ? "store" : "", n.kind === "gate" ? "gate" : "", n.hatched ? "hat" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <span
              key={n.id}
              className={cls}
              style={{ left: `${((n.x - w / 2) / 24) * 100}%`, top: n.y * UY_PX, width: `${(w / 24) * 100}%` }}
              {...(n.hatched ? { "data-ink": "neg" } : {})}
            >
              <b>
                <KeepHyphens text={n.label} />
              </b>
            </span>
          );
        })}
      </div>

      <ol className="slist">
        {rows.map((row) => (
          <li key={row.ids.join(">")}>
            <span className="chain">
              {row.ids.map((id, i) => {
                const n = byId.get(id)!;
                return (
                  <span key={`${id}-${i}`}>
                    {i > 0 ? <span className="arrow"> → </span> : null}
                    <span className={n.hatched ? "nd hat" : "nd"} {...(n.hatched ? { "data-ink": "neg" } : {})}>
                      {n.label}
                    </span>
                  </span>
                );
              })}
            </span>
            {row.labels.length ? <small>{row.labels.join(" · ")}</small> : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}
