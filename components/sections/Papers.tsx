import { listings, publications } from "@/lib/content";
import Arrow from "@/components/ui/Arrow";

/** The paper as a row like the work (with its own knot), the one in submission under it, and the PDF. */
export default function Papers() {
  const shown = publications.filter((p) => p.plain && p.media.pdf);
  if (!shown.length) return null;
  return (
    <section id="papers" className="sec" aria-labelledby="h-papers">
      <h2 className="eyebrow" id="h-papers">
        Papers
      </h2>
      <ol className="rows">
        {shown.map((p) => (
          <li key={p.slug}>
            <a className="row" href={`/papers/${p.slug}/`} data-form={p.slug}>
              <span className="row-name">{p.shortTitle}</span>
              <span className="row-field">{p.plain!.line}</span>
              <span className="row-num">{p.plain!.num}</span>
            </a>
          </li>
        ))}
        {listings.map((l) => (
          <li key={l.title} className="row quiet">
            <span className="row-name small">{l.title}</span>
            <span className="row-field">{l.status}</span>
          </li>
        ))}
      </ol>
      {shown.map((p) => (
        <a key={p.slug} className="go" href={p.media.pdf} target="_blank" rel="noreferrer noopener">
          Read the {p.shortTitle} preprint <Arrow />
        </a>
      ))}
    </section>
  );
}
