import { Fragment } from "react";
import { listings, publications } from "@/lib/content";
import KeepHyphens from "@/components/KeepHyphens";

/**
 * Papers, set like a reference list on the same rows as the work: the
 * year, the title (linked to its page) and authors as the PDF prints them,
 * the status in the paper's own words, and the one pair that is the result
 * — the policy against the static-role control. A paper still in submission gets its
 * title, one line and its status, and nothing that would need the
 * manuscript to check.
 */
export default function Papers() {
  const shown = publications.filter((p) => p.claim && p.media.pdf);

  return (
    <section className="sec" id="papers" aria-labelledby="h-papers">
      <header className="sh g12">
        <h2 id="h-papers">Papers</h2>
      </header>
      <ol className="rows">
        {shown.map((p) => {
          const fig = p.figures.find((f) => f.kind === "pairs");
          const pair = fig && fig.kind === "pairs" ? fig.pairs[fig.pairs.length - 1] : undefined;
          return (
            <li key={p.slug} className="row p g12">
              <div className="st wide">
                <h3 className="pt">
                  <a href={`/papers/${p.slug}/`}>
                    <KeepHyphens text={p.title} />
                  </a>
                </h3>
                <p className="au">
                  {(p.authorList ?? []).map((a, i) => (
                    <Fragment key={a.name}>
                      {i > 0 ? ", " : null}
                      <span className="nw">{a.name}</span> <span className="aff">({a.affiliation})</span>
                    </Fragment>
                  ))}
                </p>
                <p className="ps">
                  {p.year} · {p.status}
                </p>
                <p className="go">
                  <a className="u" href={p.media.pdf} target="_blank" rel="noreferrer noopener">
                    PDF
                  </a>
                </p>
              </div>
              {pair ? (
                <div className="ms">
                  <p className="v">
                    {pair.b.value}
                    <span className="unit">%</span>
                  </p>
                  <p className="c">
                    {pair.b.label}, {pair.label}
                  </p>
                  <p className="a">
                    {pair.a.label}: {pair.a.value}%
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
        {listings.map((l) => (
          <li key={l.title} className="row p g12">
            <div className="st wide">
              <h3 className="pt">
                <KeepHyphens text={l.title} />
              </h3>
              <p className="au">{l.subtitle}</p>
            </div>
            <div className="ms">
              <p className="a">{l.status}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
