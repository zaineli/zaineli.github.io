import { negativeCount, publications, shownLedger, systems, techPath, type LedgerKind } from "@/lib/content";
import { smart } from "@/lib/typo";

/** What each kind of "no" is, in words a visitor knows. */
const KIND: Record<LedgerKind, string> = {
  mechanism: "idea that didn’t help",
  result: "result",
  hypothesis: "guess that was wrong",
  estimate: "estimate that was off",
  bug: "bug",
};

/**
 * Everything in these projects that didn't work, project by project: what
 * was tried, the number that showed it, and what kind of miss it was. Each
 * row opens the part of the write-up where it is recorded.
 */
export default function SaidNo() {
  const groups = [
    ...systems.map((s) => ({
      id: s.slug,
      name: s.name,
      line: s.plain.line,
      // a brief page sends the reader to the technical page, where the section is
      href: (anchor: string) => `${techPath(s)}#${anchor}`,
      page: `/systems/${s.slug}/`,
      rows: shownLedger(s.ledger),
    })),
    ...publications.map((p) => ({
      id: p.slug,
      name: p.shortTitle,
      line: p.plain?.line ?? "",
      href: (anchor: string) => `/papers/${p.slug}/#${anchor}`,
      page: `/papers/${p.slug}/`,
      rows: shownLedger(p.ledger ?? []),
    })),
  ].filter((g) => g.rows.length > 0);

  return (
    <article className="wrap said">
      <p className="crumb">
        <a href="/#work">← All work</a>
      </p>
      <header className="page-head">
        <h1>What didn’t work</h1>
        <p className="page-lede">
          A portfolio of only successes isn’t proof of good judgement. Here is everything in these projects that didn’t
          work, <span className="count">{negativeCount}</span> things in all, each with the number that showed it.
        </p>
      </header>
      {groups.map((g) => (
        <section key={g.id} className="lg" id={`no-${g.id}`} aria-labelledby={`h-no-${g.id}`}>
          <div className="lg-head">
            <h2 id={`h-no-${g.id}`}>
              <a href={g.page}>{g.name}</a>
            </h2>
            <p>{g.line}</p>
          </div>
          <ol className="lrows">
            {g.rows.map((e) => (
              <li key={e.id}>
                <a className="lrow" href={g.href(e.anchor)}>
                  <span className="t">{smart(e.term)}</span>
                  <span className="x" data-ink="neg">
                    {e.number ?? ""}
                  </span>
                  <span className="kd">{KIND[e.kind]}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
}
