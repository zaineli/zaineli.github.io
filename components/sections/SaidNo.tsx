import { ledgerKinds, negativeCount, profile, publications, shownLedger, systems } from "@/lib/content";

/**
 * Errata: every result that said no, by name, printed once and statically.
 * The count is in the HTML — never counted up — and nothing hides behind a
 * disclosure. One table grouped by system in the Systems order: what was
 * tried, in his words and in the serif; the number that said no, in the
 * grotesk and the only colour on the site; what kind of no it was. Each row
 * links to the section of the write-up where it is recorded, and each group
 * is where its row's "N said no" lands.
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
    <section className="sec" id="said-no" aria-labelledby="h-no">
      <div className="caption g12">
        <p className="statement">{profile.ledgerLine}</p>
      </div>
      <div className="sh g12">
        <h2 id="h-no">What said no</h2>
        <span className="hd h4" aria-hidden="true">
          Tried
        </span>
        <span className="hd h9" aria-hidden="true">
          What the numbers said
        </span>
        <span className="hd h12" aria-hidden="true">
          Kind
        </span>
      </div>
      <div className="nobody g12">
        <div className="count">
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
        <div className="ledger">
          {groups.map((g) => (
            <div key={g.id} className="lg" id={`no-${g.id}`}>
              <h3>{g.name}</h3>
              {g.rows.map((e) => (
                <a key={e.id} className="lrow" href={g.href(e.anchor)}>
                  <span className="t">{e.term}</span>
                  <span className="x" data-ink="neg">
                    {e.number ?? ""}
                  </span>
                  <span className="kd">{e.kind}</span>
                  {e.quote ? <span className="q">{e.quote.startsWith("“") ? e.quote : `“${e.quote}”`}</span> : null}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
