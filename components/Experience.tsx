import { experience } from "@/lib/content";
import Reveal from "./Reveal";
import { Row } from "./Section";

export default function Experience() {
  return (
    <div className="flex flex-col">
      {experience.map((role, i) => (
        <Reveal key={role.company} delay={i * 50}>
          <Row
            index={String(i + 1).padStart(2, "0")}
            meta={
              <>
                <span className="block whitespace-nowrap">{role.period}</span>
                <span className="mt-1 block text-fg-faint">{role.location}</span>
              </>
            }
            first={i === 0}
          >
            <h3 className="t-item-title">
              {role.company}
              <span className="font-normal text-fg-subtle"> — {role.title}</span>
            </h3>

            {role.summary ? <p className="t-body mt-2.5 max-w-[66ch]">{role.summary}</p> : null}

            <ul className="mt-4 flex flex-col gap-2">
              {role.points.map((p) => (
                <li key={p.slice(0, 24)} className="t-body flex max-w-[68ch] gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.72em] h-px w-3 shrink-0 bg-accent-muted"
                  />
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
          </Row>
        </Reveal>
      ))}
    </div>
  );
}
