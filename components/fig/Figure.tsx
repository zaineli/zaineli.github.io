import type { FigureSpec } from "@/lib/content";
import Bars from "./Bars";
import DataTable from "./DataTable";
import Diverging from "./Diverging";
import Dots from "./Dots";
import Lines from "./Lines";
import Pairs from "./Pairs";

/**
 * One figure, generated from the numbers in lib/content.ts. Server-rendered
 * with its final geometry, so a crawler, a printer or a reader without
 * JavaScript sees the whole figure; only line figures hydrate, to measure
 * their width. Every figure carries its numbers as a visually hidden table.
 */
export default function Figure({
  spec,
  className = "fig",
}: {
  spec: FigureSpec;
  /** "fig" in a home column; "cfig" in a case section. */
  className?: string;
}) {
  const caption = spec.caption ?? spec.title;
  return (
    <figure className={className} {...(spec.negative ? { "data-negative": "" } : {})}>
      {caption ? <figcaption>{caption}</figcaption> : null}
      {spec.kind === "bars" ? <Bars spec={spec} /> : null}
      {spec.kind === "lines" ? <Lines spec={spec} /> : null}
      {spec.kind === "dots" ? <Dots spec={spec} /> : null}
      {spec.kind === "pairs" ? <Pairs spec={spec} /> : null}
      {spec.kind === "diverging" ? <Diverging spec={spec} /> : null}
      {/* The band carries its own label; every other kind is read from the table. */}
      {spec.kind === "dots" ? null : <DataTable spec={spec} />}
    </figure>
  );
}
