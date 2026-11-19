import { longDate, writing } from "@/lib/writing";
import Arrow from "@/components/ui/Arrow";

/**
 * Writing at Alexein: each post as one quiet row under the papers, its
 * title and the day it went out, opening the post on alexein.ai. No number
 * and no knot (no data-form): the claim is the title's, and the post it
 * links to holds the evidence.
 */
export default function Writing() {
  if (!writing.length) return null;
  return (
    <section id="writing" className="sec" aria-labelledby="h-writing">
      <h2 className="eyebrow" id="h-writing">
        Writing at Alexein
      </h2>
      <ol className="rows">
        {writing.map((w) => (
          <li key={w.href}>
            <a className="row quiet" href={w.href} target="_blank" rel="noopener">
              <span className="row-name small">{w.title}</span>
              <span className="row-field">
                <span className="what">
                  <time dateTime={w.date}>{longDate(w.date)}</time>
                </span>
                <span className="counts">
                  On alexein.ai <Arrow />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
