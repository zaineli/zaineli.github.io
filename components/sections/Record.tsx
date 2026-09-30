import { education, experience, priors } from "@/lib/content";

/**
 * The record, one row per role and one number per row: when, where and as
 * what, then the outcome in the grotesk with its label beneath. The current
 * role has no number, so it carries his own two lines instead; the masthead
 * owns the current title, so this row does not repeat it. Education closes
 * the table with the two rankings that have a clear denominator.
 */
export default function Record() {
  const shownPriors = priors.filter((p) => p.home);

  return (
    <section className="sec" id="record" aria-labelledby="h-rec">
      <div className="sh g12">
        <h2 id="h-rec">Record</h2>
        <span className="hd h4" aria-hidden="true">
          Role
        </span>
        <span className="hd h7" aria-hidden="true">
          Outcome
        </span>
      </div>
      <div className="rec">
        {experience.map((role, i) => {
          const o = role.outcomes[0];
          return (
            <div key={role.company} className="rrow g12">
              <p className="p">{role.period}</p>
              <p className="o">
                {role.company}
                {i > 0 ? <span>{role.title}</span> : null}
              </p>
              <div className="out">
                {role.gloss ? (
                  <>
                    <p className="gloss">{role.gloss}</p>
                    {role.glossLine ? <p className="l">{role.glossLine}</p> : null}
                  </>
                ) : o ? (
                  <>
                    <p className="v">{o.value}</p>
                    <p className="l">
                      {o.href ? (
                        <a className="u" href={o.href} target="_blank" rel="noreferrer noopener">
                          {o.label}
                        </a>
                      ) : (
                        o.label
                      )}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
        <div className="rrow g12">
          <p className="p">{education.period}</p>
          <p className="o">
            {education.short}
            <span>{education.degree}</span>
          </p>
          <div className="out">
            {shownPriors.length ? (
              <p className="l pri">
                {shownPriors.map((p) => (
                  <span key={p.label} className="pr">
                    {p.label}, <b>{p.rank}</b>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
