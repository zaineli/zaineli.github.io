import { experience } from "@/lib/content";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <div className="flex flex-col">
      {experience.map((role, i) => (
        <Reveal key={role.company} delay={i * 60}>
          <article
            className={`grid gap-x-10 gap-y-3 py-8 md:grid-cols-[minmax(0,13rem)_1fr] ${
              i === 0 ? "pt-0" : "border-t border-border-subtle"
            }`}
          >
            <div>
              <p className="t-mono whitespace-nowrap">{role.period}</p>
              <p className="t-mono mt-1 text-fg-faint">{role.location}</p>
            </div>

            <div>
              <h3 className="t-item-title">
                {role.company}
                <span className="font-normal text-fg-subtle"> — {role.title}</span>
              </h3>

              {role.summary ? <p className="t-body mt-2 max-w-[62ch]">{role.summary}</p> : null}

              <ul className="mt-4 flex flex-col gap-2">
                {role.points.map((p) => (
                  <li key={p.slice(0, 24)} className="t-body flex max-w-[64ch] gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-border-default" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              {role.stack?.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {role.stack.map((s) => (
                    <span key={s} className="pill">
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
