import { profile, systems } from "@/lib/content";
import Arrow from "@/components/ui/Arrow";

/**
 * One card per project: its name, one plain line, one big result and what
 * that result means. The card opens the write-up; the GitHub link opens the
 * code. The first two cards run wide, the rest in threes.
 */
export default function Projects() {
  const wide = systems.length % 3 === 2 ? 2 : systems.length % 3 === 1 ? 4 : 0;
  return (
    <section id="projects" className="wrap sec" aria-labelledby="h-projects">
      <div className="grid">
        <h2 className="sec-title" id="h-projects">
          Projects
        </h2>
        <div className="sec-body">
          <p className="sec-intro">{profile.projectsIntro}</p>
        </div>
      </div>
      <div className="grid cards">
        {systems.map((s, i) => (
          <article key={s.slug} className={`card${i < wide ? " wide" : ""}`} id={s.slug}>
            <div className="card-head">
              <h3>
                <a className="stretch" href={`/systems/${s.slug}/`}>
                  {s.name}
                </a>
              </h3>
              <a className="repo" href={s.repo} target="_blank" rel="noreferrer noopener">
                GitHub <Arrow />
              </a>
            </div>
            <p className="card-desc">{s.plain.line}</p>
            <p className="num">
              {s.plain.num}
              {s.plain.vs ? <span className="vs">{s.plain.vs}</span> : null}
            </p>
            <p className="cap">{s.plain.cap}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
