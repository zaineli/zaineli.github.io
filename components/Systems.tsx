import Link from "next/link";
import { systems } from "@/lib/content";
import Reveal from "./Reveal";
import { Row } from "./Section";

export default function Systems() {
  return (
    <div className="flex flex-col">
      {systems.map((s, i) => (
        <Reveal key={s.slug} delay={i * 50}>
          <Row
            index={String(i + 1).padStart(2, "0")}
            meta={
              <>
                <span className="block">{s.year}</span>
                <span className="mt-1.5 block text-fg-faint">{s.tags.join(" · ")}</span>
              </>
            }
            first={i === 0}
          >
            <h3 className="t-item-title">
              <Link href={`/systems/${s.slug}`} className="link">
                {s.name}
              </Link>
              <span className="font-normal text-fg-subtle"> — {s.tagline}</span>
            </h3>

            <p className="t-body mt-2.5 max-w-[68ch]">{s.abstract}</p>

            <dl className="mt-5 flex flex-wrap gap-x-9 gap-y-3">
              {s.metrics.map((m) => (
                <div key={m.label}>
                  <dd className={`t-metric ${m.emphasis ? "text-accent" : ""}`}>{m.value}</dd>
                  <dt className="t-mono mt-0.5">{m.label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link href={`/systems/${s.slug}`} className="pill">
                Write-up
              </Link>
              <a href={s.repo} target="_blank" rel="noreferrer noopener" className="pill">
                Source ↗
              </a>
            </div>
          </Row>
        </Reveal>
      ))}
    </div>
  );
}
