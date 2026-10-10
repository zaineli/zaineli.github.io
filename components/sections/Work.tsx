import { profile, shownLedger, systems } from "@/lib/content";
import KeepHyphens from "@/components/KeepHyphens";
import Num from "@/components/Num";

/**
 * The work, one ruled row per system: what it asks in plain words, the one
 * thing that said no — its label in the site's only colour, linked to the
 * full list — and the one number it stands on with what that number was
 * measured against. No figures here; they live in the write-ups.
 */
export default function Work() {
  return (
    <section className="sec" id="work" aria-labelledby="h-work">
      <header className="sh g12">
        <h2 id="h-work">Work</h2>
        <p className="sl">{profile.workLine}</p>
      </header>
      <ol className="rows">
        {systems.map((s) => {
          const said = shownLedger(s.ledger).length;
          return (
            <li key={s.slug} className="row w g12" id={s.slug}>
              <div className="nm">
                <h3>
                  <a href={`/systems/${s.slug}/`}>{s.name}</a>
                </h3>
                <p className="fld">{s.thread}</p>
              </div>
              <div className="st">
                <p className="q">
                  <KeepHyphens text={s.question} />
                </p>
                <p className="no">
                  {said ? (
                    <a className="mk" href={`/said-no/#no-${s.slug}`} data-ink="neg">
                      Said no
                    </a>
                  ) : (
                    <span className="mk" data-ink="neg">
                      Said no
                    </span>
                  )}{" "}
                  {s.no}
                </p>
                <p className="go">
                  <a className="u" href={`/systems/${s.slug}/`}>
                    Write-up
                  </a>
                  <a className="u" href={s.repo} target="_blank" rel="noreferrer noopener">
                    Code
                  </a>
                </p>
              </div>
              <div className="ms">
                <p className="v">
                  <Num value={s.lead.value} unit={s.lead.unit} />
                </p>
                <p className="c">
                  <KeepHyphens text={s.lead.label} />
                </p>
                {s.lead.after ? <p className="a">{s.lead.after}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
