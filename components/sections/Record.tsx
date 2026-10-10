import { education, experience } from "@/lib/content";

/** Experience and education as two short lists: when, where, as what, and one line of what came of it. */
export default function Record() {
  return (
    <>
      <section id="experience" className="wrap sec" aria-labelledby="h-exp">
        <div className="grid">
          <h2 className="sec-title" id="h-exp">
            Experience
          </h2>
          <div className="sec-body">
            <ol className="rows">
              {experience.map((r, i) => (
                <li key={r.company} className="row">
                  <p className={`when${i === 0 ? " when-now" : ""}`}>
                    {i === 0 ? <span className="dot" aria-hidden="true" /> : null}
                    {r.period}
                  </p>
                  <div className="row-body">
                    <h3>
                      {r.company} <span>· {r.title}</span>
                    </h3>
                    <p>{r.plain}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section id="education" className="wrap sec" aria-labelledby="h-edu">
        <div className="grid">
          <h2 className="sec-title" id="h-edu">
            Education
          </h2>
          <div className="sec-body">
            <ol className="rows">
              <li className="row">
                <p className="when">{education.period}</p>
                <div className="row-body">
                  <h3>
                    {education.short} <span>· {education.degree}</span>
                  </h3>
                  <p>{education.plain}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
