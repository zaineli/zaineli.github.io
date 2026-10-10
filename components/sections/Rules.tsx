import { negativeCount, rules, rulesLine } from "@/lib/content";

/**
 * How he works, in five lines he wrote down and committed — the personality
 * as rules, not adjectives — straight under the opening, before the work
 * that keeps them. Each names where it is written. The last row is the
 * evidence: the count of results on this site that said no, and the page
 * that lists every one.
 */
export default function Rules() {
  return (
    <section className="sec" id="how" aria-labelledby="h-how">
      <header className="sh g12">
        <h2 id="h-how">How I work</h2>
        <p className="sl">{rulesLine}</p>
      </header>
      <ol className="rows">
        {rules.map((r) => (
          <li key={r.text} className="row r g12">
            <p className="rule">{r.text}</p>
            <p className="src">
              {r.href ? (
                <a className="u" href={r.href} target="_blank" rel="noreferrer noopener">
                  {r.source}
                </a>
              ) : (
                r.source
              )}
            </p>
          </li>
        ))}
        <li className="row r tally g12">
          <p className="rule">
            <span className="n" data-ink="neg">
              {negativeCount}
            </span>{" "}
            results on this site said no. Each is listed with what said it.
          </p>
          <p className="src">
            <a className="u" href="/said-no/">
              What said no
            </a>
          </p>
        </li>
      </ol>
    </section>
  );
}
