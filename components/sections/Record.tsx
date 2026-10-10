import { education, experience, priors } from "@/lib/content";

/**
 * The record on the same rows: when and where, as what, and one outcome.
 * The current role has no number yet, so it carries none. Education closes
 * it with the two rankings he gave.
 */
export default function Record() {
  const shownPriors = priors.filter((p) => p.home);

  return (
    <section className="sec" id="record" aria-labelledby="h-rec">
      <header className="sh g12">
        <h2 id="h-rec">Record</h2>
      </header>
      <ol className="rows">
        {experience.map((role) => {
          const o = role.outcomes[0];
          return (
            <li key={role.company} className="row rec g12">
              <div className="nm">
                <h3>{role.company}</h3>
                <p className="when">{role.period}</p>
              </div>
              <div className="st">
                <p className="ttl">{role.title}</p>
              </div>
              <div className="ms">
                {o ? (
                  <>
                    <p className="v sm">{o.value}</p>
                    <p className="c">
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
            </li>
          );
        })}
        <li className="row rec g12">
          <div className="nm">
            <h3>{education.short}</h3>
            <p className="when">{education.period}</p>
          </div>
          <div className="st">
            <p className="ttl">{education.degree}</p>
          </div>
          <div className="ms">
            {shownPriors.map((p) => (
              <p key={p.label} className="c">
                {p.label}, <b>{p.rank}</b>
              </p>
            ))}
          </div>
        </li>
      </ol>
    </section>
  );
}
