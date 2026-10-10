import { publications } from "@/lib/content";
import Arrow from "@/components/ui/Arrow";

/** The paper, as one dark card: what it is, who wrote it, and the one result, in plain words. */
export default function Papers() {
  const shown = publications.filter((p) => p.plain && p.media.pdf);
  if (!shown.length) return null;
  return (
    <section id="paper" className="wrap sec" aria-labelledby="h-paper">
      <div className="grid">
        <h2 className="sec-title" id="h-paper">
          Paper
        </h2>
        <div className="sec-body">
          {shown.map((p) => (
            <article key={p.slug} className="paper">
              <div className="paper-main">
                <p className="paper-meta">Preprint, {p.year}</p>
                <h3>
                  <a href={`/papers/${p.slug}/`}>{p.shortTitle}</a>
                </h3>
                <p className="paper-desc">{p.plain!.line}</p>
                <p className="paper-with">{p.plain!.with}</p>
              </div>
              <div className="actions paper-cta">
                <a className="btn" href={p.media.pdf} target="_blank" rel="noreferrer noopener">
                  Read the PDF <Arrow />
                </a>
              </div>
              <div className="paper-result">
                <p className="num">
                  {p.plain!.num}
                  <span className="vs">{p.plain!.vs}</span>
                </p>
                <p className="cap">{p.plain!.cap}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
