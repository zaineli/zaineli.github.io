import type { FigureSpec, LedgerEntry, SystemSection } from "@/lib/content";
import { slugify } from "@/lib/slug";
import Figure from "../fig/Figure";

export interface Note {
  text: string;
  neg?: boolean;
}

/**
 * One section of a write-up on the 12-column sheet: the heading in the
 * first major, the body in columns 4–9 at a reading measure, and — in the
 * margin beside the claims they refute — the ledger entries recorded here,
 * each under a red rule. A hypothesis note strikes what was expected, in
 * ink, and prints what was measured beneath it; that is the only strike on
 * the site. The id is slugify(heading): every "said no" link lands on it.
 */
export default function CaseSection({
  section,
  figures,
  own,
  ledger = [],
  notes = [],
}: {
  section: SystemSection;
  figures: FigureSpec[];
  /** Column header that belongs to this system, bold in the table. */
  own: string;
  ledger?: LedgerEntry[];
  notes?: Note[];
}) {
  const id = slugify(section.heading);
  const hasMargin = ledger.length > 0 || notes.length > 0;
  // A section that records something that said no is a negative section,
  // whatever its flag says — so the red rule, the filter and the margin
  // notes can never disagree.
  const neg = section.negative === true || ledger.length > 0 || notes.some((n) => n.neg);

  return (
    <section id={id} className={`cs g12${neg ? " neg" : ""}`}>
      <h2>{section.heading}</h2>
      <div className="body">
        {figures.map((spec) => (
          <Figure
            key={spec.id}
            spec={spec}
            className={`cfig${spec.kind === "lines" || spec.kind === "diverging" ? " wide" : ""}`}
          />
        ))}

        {section.table ? (
          <div className="tw" tabIndex={0} role="region" aria-label={`${section.heading}, table`}>
            <table className={`t${section.table.head.length > 6 ? " wide" : ""}`}>
              <thead>
                <tr>
                  {section.table.head.map((h, i) => (
                    <th key={`${h}-${i}`} scope="col" {...(h === own ? { "data-own": "" } : {})}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row) => (
                  <tr key={row.join("|")}>
                    {row.map((cell, i) => (
                      <td key={`${cell}-${i}`} {...(section.table!.head[i] === own ? { "data-own": "" } : {})}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {section.table.caption ? <p className="tcap">{section.table.caption}</p> : null}
          </div>
        ) : null}

        {section.paragraphs?.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}

        {section.list?.length ? (
          <dl>
            {section.list.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {hasMargin ? (
        <aside className="note" aria-label={`${neg ? "Said no" : "Note"}: ${section.heading}`}>
          {ledger.map((e) => (
            <div key={e.id} className="item" data-ink="neg">
              <p className="t">{e.term}</p>
              {e.number ? <p className="x">{e.number}</p> : null}
              {e.kind === "hypothesis" && e.expected ? (
                <>
                  <p className="ex">
                    <s>{e.expected}</s>
                  </p>
                  {e.measured ? <p className="me">{e.measured}</p> : null}
                </>
              ) : null}
            </div>
          ))}
          {notes.map((n) => (
            <div key={n.text} className={`item${n.neg ? "" : " ink"}`} {...(n.neg ? { "data-ink": "neg" } : {})}>
              <p className="t">{n.text}</p>
            </div>
          ))}
        </aside>
      ) : null}
    </section>
  );
}
