import { Fragment } from "react";
import { listings, publications } from "@/lib/content";
import KeepHyphens from "@/components/KeepHyphens";

/**
 * Papers, set like a reference list with the evidence beside each entry.
 * A public paper gets its first page (the link to the PDF), its title and
 * author block exactly as the PDF prints them, the abstract's last sentence
 * split at its semicolon — the claim in ink, the paper's own limit in red —
 * and the one pair that is the result: the policy against the static-role
 * control, under adversarial profiles. A paper still in submission gets its
 * title, one line and its status, and nothing that would need the
 * manuscript to check.
 */
export default function Papers() {
  const shown = publications.filter((p) => p.claim && p.media.pdf);

  return (
    <section className="sec" id="papers" aria-labelledby="h-papers">
      <div className="sh g12">
        <h2 id="h-papers">Papers</h2>
      </div>
      <div className="pt">
        {shown.map((p) => {
          const fig = p.figures.find((f) => f.kind === "pairs");
          const pair = fig && fig.kind === "pairs" ? fig.pairs[fig.pairs.length - 1] : undefined;
          const measure = fig ? fig.title.split(" by ")[0] : "";
          return (
            <article key={p.slug} className="p-row g12" aria-labelledby={`h-${p.slug}`}>
              {p.media.page1 ? (
                <a className="page" href={p.media.pdf} target="_blank" rel="noreferrer noopener" aria-label={`${p.shortTitle} preprint, PDF`}>
                  <img
                    src={p.media.page1}
                    srcSet={`${p.media.page1.replace(".webp", "-360.webp")} 360w, ${p.media.page1.replace(".webp", "-660.webp")} 660w, ${p.media.page1} 824w`}
                    sizes="(max-width: 639px) 34vw, (max-width: 1023px) 22vw, 206px"
                    width={824}
                    height={1067}
                    loading="lazy"
                    decoding="async"
                    alt={`First page of the ${p.shortTitle} preprint`}
                  />
                </a>
              ) : null}
              <div className="p-main">
                <h3 className="p-title" id={`h-${p.slug}`}>
                  <a href={`/papers/${p.slug}/`}>
                    <KeepHyphens text={p.title} />
                  </a>
                </h3>
                <p className="p-auth">
                  {(p.authorList ?? []).map((a, i) => (
                    <Fragment key={a.name}>
                      {i > 0 ? <span className="sep"> · </span> : null}
                      <span className="au nw">
                        <b>{a.name}</b> <span className="aff">{a.affiliation}</span>
                      </span>
                    </Fragment>
                  ))}
                </p>
                {p.claim ? (
                  <p className="p-claim">
                    <b>{p.claim.lead}</b> <KeepHyphens text={p.claim.rest} />{" "}
                    {p.limit ? (
                      <span className="limit" data-ink="neg">
                        {p.limit}
                      </span>
                    ) : null}
                  </p>
                ) : null}
                <p className="p-status">{p.status}</p>
                <p className="go">
                  <a className="u" href={`/papers/${p.slug}/`}>
                    Paper page
                  </a>
                  <a className="u" href={p.media.pdf} target="_blank" rel="noreferrer noopener">
                    PDF
                  </a>
                </p>
              </div>
              {pair ? (
                <figure className="p-pair">
                  <figcaption>
                    {measure} · {pair.label}
                  </figcaption>
                  <div className="pp">
                    <p className="num">
                      {pair.b.value}
                      <span className="unit">%</span>
                    </p>
                    <p className="k">{pair.b.label}</p>
                  </div>
                  <div className="pp base">
                    <p className="num">
                      {pair.a.value}
                      <span className="unit">%</span>
                    </p>
                    <p className="k">{pair.a.label}</p>
                  </div>
                </figure>
              ) : null}
            </article>
          );
        })}
        {listings.map((l) => (
          <article key={l.title} className="p-row listed g12" aria-label={l.title}>
            <div className="p-main">
              <h3 className="p-title">
                <KeepHyphens text={l.title} />
              </h3>
              <p className="p-sub">{l.subtitle}</p>
              <p className="p-status">{l.status}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
