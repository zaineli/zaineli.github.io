import { archived, featured, home, negativeCount } from "@/lib/content";

/**
 * Selected work: three projects, each its name, what it is, what its number
 * counts, and the number. The row opens the write-up; pointing at it turns
 * the knot beside it into that project's knot (data-form, read by /fig0.js).
 * The rest of the work sits on one line beneath, still written up.
 */
export default function Projects() {
  return (
    <section id="work" className="sec" aria-labelledby="h-work">
      <h2 className="eyebrow" id="h-work">
        Selected work
      </h2>
      <ol className="rows">
        {featured.map((s) => (
          <li key={s.slug} id={s.slug}>
            <a className="row" href={`/systems/${s.slug}/`} data-form={s.slug}>
              <span className="row-name">{s.name}</span>
              <span className="row-field">
                <span className="what">{home.fields[s.slug] ?? s.plain.line}</span>
                {home.numCaps[s.slug] ? <span className="counts">{home.numCaps[s.slug]}</span> : null}
              </span>
              <span className="row-num">{s.plain.num}</span>
            </a>
          </li>
        ))}
      </ol>
      {archived.length ? (
        <p className="also">
          {home.alsoLine}{" "}
          {archived.map((s, i) => (
            <span key={s.slug}>
              <a href={`/systems/${s.slug}/`}>{s.name}</a>
              <span className="what"> ({home.fields[s.slug]?.toLowerCase() ?? s.plain.line})</span>
              {i < archived.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      ) : null}
      <a className="ledger" href="/said-no/">
        <b>{negativeCount}</b> {home.ledger} <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
