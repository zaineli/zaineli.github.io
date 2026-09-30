import { shownLedger, shownTagline, systems } from "@/lib/content";
import Figure from "@/components/fig/Figure";
import KeepHyphens from "@/components/KeepHyphens";
import SpecLine from "@/components/SpecLine";

/**
 * The results table. A reader from a lab does not trust a headline number;
 * they look for the control. So every system is one row of three columns:
 * what it is, the number it reports and what that number means, and the
 * figure of what it was measured against — baselines, a held-out gate, a
 * uniform-length control, an oracle. Booktabs rules: heavy top, a rule
 * under the heads, heavy bottom. The conditions and the links close each
 * row, so the scale is labelled, not discovered.
 */
export default function Systems() {
  return (
    <section className="sec" id="systems" aria-labelledby="h-systems">
      <div className="sh g12">
        <h2 id="h-systems">Systems</h2>
        <span className="hd h4" aria-hidden="true">
          Result
        </span>
        <span className="hd h7" aria-hidden="true">
          Measured against
        </span>
      </div>
      <div className="rt">
        {systems.map((s) => {
          const said = shownLedger(s.ledger).length;
          const neg = s.lead.negative === true;
          return (
            <article key={s.slug} className="rt-row g12" id={s.slug} aria-labelledby={`h-${s.slug}`}>
              <div className="c-id">
                <h3 className="s-name" id={`h-${s.slug}`}>
                  <a href={`/systems/${s.slug}/`}>{s.name}</a>
                </h3>
                <p className="s-tag">
                  <KeepHyphens text={shownTagline(s)} />
                </p>
                <p className="s-field">{s.thread}</p>
              </div>
              <div className="c-res">
                <p className={`num${neg ? " neg" : ""}`} {...(neg ? { "data-ink": "neg" } : {})}>
                  {s.lead.value}
                  {s.lead.unit ? <span className="unit">{s.lead.unit}</span> : null}
                </p>
                <p className="cap">
                  <KeepHyphens text={s.lead.label} />
                </p>
                {s.lead.after ? (
                  <p className="turn">
                    <KeepHyphens text={s.lead.after} />
                  </p>
                ) : null}
                <p className="line">{s.homeLine}</p>
              </div>
              <div className="c-fig">
                <Figure spec={{ ...s.homeFigure, caption: s.homeFigure.caption || s.homeFigure.title }} />
              </div>
              <div className="rt-foot">
                <p className="spec">
                  <SpecLine text={s.spec} />
                </p>
                <p className="go">
                  <a className="u" href={`/systems/${s.slug}/`}>
                    Write-up
                  </a>
                  <a className="u" href={s.repo} target="_blank" rel="noreferrer noopener">
                    Code
                  </a>
                  {said ? (
                    <a className="u no" href={`#no-${s.slug}`} data-ink="neg">
                      {said} said no
                    </a>
                  ) : null}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
