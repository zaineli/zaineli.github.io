import { ledgerKinds, negativeCount, profile, publications, shownLedger, systems } from "@/lib/content";
import { smart } from "@/lib/typo";

/**
 * Every result on the site that said no, by name, printed once and
 * statically, grouped by system in the order of the work. What was tried,
 * in his words; the number that said no, in the site's only colour; what
 * kind of no it was. Each row links to the section of the write-up where
 * it is recorded, and each group is where a work row's "N said no" lands.
 */
export default function SaidNo() {
  const groups = [
    ...systems.map((s) => ({
      id: s.slug,
      name: s.name,
      href: (anchor: string) => `/systems/${s.slug}/#${anchor}`,
      rows: shownLedger(s.ledger),
    })),
    ...publications.map((p) => ({
      id: p.slug,
      name: p.shortTitle,
      href: (anchor: string) => `/papers/${p.slug}/#${anchor}`,
      rows: shownLedger(p.ledger ?? []),
    })),
  ].filter((g) => g.rows.length > 0);

  return (
    <article className="said">
      <header className="chero g12">
        <h1 className="cname">What said no</h1>
        <p className="ctag">{profile.ledgerLine}</p>
      </header>
      <div className="tallyrow g12">
        <p className="n" data-ink="neg">
          <span aria-hidden="true">{negativeCount}</span>
          <span data-sr="">{`${negativeCount} negative results`}</span>
        </p>
        <ul className="kinds">
          {ledgerKinds
            .filter((k) => k.count > 0)
            .map((k) => (
              <li key={k.kind}>
                <b>{k.count}</b> {k.noun}
              </li>
            ))}
        </ul>
      </div>
      {groups.map((g) => (
        <section key={g.id} className="lg g12" id={`no-${g.id}`} aria-labelledby={`h-no-${g.id}`}>
          <h2 id={`h-no-${g.id}`}>
            <a href={g.href("").replace(/#$/, "")}>{g.name}</a>
          </h2>
          <ol className="lrows">
            {g.rows.map((e) => (
              <li key={e.id}>
                <a className="lrow" href={g.href(e.anchor)}>
                  <span className="t">{smart(e.term)}</span>
                  <span className="x" data-ink="neg">
                    {e.number ?? ""}
                  </span>
                  <span className="kd">{e.kind}</span>
                  {e.quote ? <span className="q">{e.quote.startsWith("“") ? smart(e.quote) : `“${smart(e.quote)}”`}</span> : null}
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
}
