import { listings, publications } from "@/lib/content";
import Arrow from "@/components/ui/Arrow";

/**
 * Every paper as one uniform row: a short title, what it asks, where it
 * stands, and its number when the number is public. The full title opens on
 * the paper's own page; the ones not yet out have no page and no number.
 */
export default function Papers() {
  const shown = publications.filter((p) => p.plain);
  if (!shown.length && !listings.length) return null;
  return (
    <section id="papers" className="sec" aria-labelledby="h-papers">
      <h2 className="eyebrow" id="h-papers">
        Papers
      </h2>
      <ol className="rows">
        {shown.map((p) => (
          <li key={p.slug}>
            <a className="row" href={`/papers/${p.slug}/`} data-form={p.form ?? p.slug}>
              <span className="row-name paper">{p.shortTitle}</span>
              <span className="row-field">
                <span className="what">{p.plain!.line}</span>
                {p.rowNote ? <span className="counts">{p.rowNote}</span> : null}
              </span>
              <span className="row-num">{p.plain!.num}</span>
            </a>
          </li>
        ))}
        {listings.map((l) => (
          <li key={l.title} className="row">
            <span className="row-name paper">{l.shortTitle}</span>
            <span className="row-field">
              <span className="what">{l.subtitle}</span>
              <span className="counts">{l.status}</span>
            </span>
            <span className="row-num" />
          </li>
        ))}
      </ol>
      {shown
        .filter((p) => p.media.pdf)
        .map((p) => (
          <a key={p.slug} className="go" href={p.media.pdf} target="_blank" rel="noreferrer noopener">
            Read the {p.shortTitle} preprint <Arrow />
          </a>
        ))}
    </section>
  );
}
