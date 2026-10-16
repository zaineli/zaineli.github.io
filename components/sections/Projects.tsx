import { home, negativeCount, systems } from "@/lib/content";

/**
 * Selected work: each project is its name, its field and one number. The
 * row opens the write-up; pointing at it turns the knot beside it into
 * that project's knot (data-form, read by /fig0.js).
 */
export default function Projects() {
  return (
    <section id="work" className="sec" aria-labelledby="h-work">
      <h2 className="eyebrow" id="h-work">
        Selected work
      </h2>
      <ol className="rows">
        {systems.map((s) => (
          <li key={s.slug} id={s.slug}>
            <a className="row" href={`/systems/${s.slug}/`} data-form={s.slug}>
              <span className="row-name">{s.name}</span>
              <span className="row-field">{home.fields[s.slug] ?? s.plain.line}</span>
              <span className="row-num">{s.plain.num}</span>
            </a>
          </li>
        ))}
      </ol>
      <a className="ledger" href="/said-no/">
        <b>{negativeCount}</b> {home.ledger} <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
