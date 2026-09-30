import type { FigureSpec } from "@/lib/content";

/**
 * Every figure's numbers as a real table, visually hidden. A screen reader,
 * a crawler and a reader with images off all get the data the marks carry.
 */
export default function DataTable({ spec }: { spec: FigureSpec }) {
  const rows: [string, string][] = [];
  switch (spec.kind) {
    case "bars":
      for (const b of spec.bars) rows.push([b.group ? `${b.group} · ${b.label}` : b.label, b.display ?? String(b.value)]);
      break;
    case "lines":
      for (const s of spec.series) {
        rows.push([s.label, s.points.map((p, i) => `${spec.x[i]}: ${p}`).join(", ")]);
      }
      if (spec.reference) rows.push([spec.reference.label, String(spec.reference.value)]);
      break;
    case "dots":
      for (const p of spec.points) {
        rows.push([p.label, p.sd != null ? `${p.value} ± ${p.sd}` : String(p.value)]);
      }
      break;
    case "pairs":
      for (const p of spec.pairs) {
        rows.push([
          p.label,
          `${p.a.label} ${p.a.display} → ${p.b.label} ${p.b.display}${p.ratio ? ` (${p.ratio})` : ""}`,
        ]);
      }
      break;
    case "diverging":
      for (const s of spec.series) {
        rows.push([s.label, s.secondary != null ? `${s.primary} (${s.secondary})` : String(s.primary)]);
      }
      break;
  }

  // The wrapper carries the hiding: a <table> ignores a 1px width and would
  // stretch the page sideways.
  return (
    <div data-sr>
      <table>
        <caption>{spec.title}</caption>
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={`${label}-${i}`}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
