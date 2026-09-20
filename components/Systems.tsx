import Link from "next/link";
import { systems } from "@/lib/content";
import Reveal from "./Reveal";

export default function Systems() {
  return (
    <div className="flex flex-col">
      {systems.map((s, i) => (
        <Reveal key={s.slug} delay={i * 60}>
          <article
            className={`grid gap-x-10 gap-y-4 py-9 md:grid-cols-[minmax(0,13rem)_1fr] ${
              i === 0 ? "pt-0" : "border-t border-border-subtle"
            }`}
          >
            <div>
              <p className="t-mono">{s.year}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="t-item-title">
                <Link href={`/systems/${s.slug}`} className="link">
                  {s.name}
                </Link>
                <span className="font-normal text-fg-subtle"> — {s.tagline}</span>
              </h3>

              <p className="t-body mt-3 max-w-[66ch]">{s.abstract}</p>

              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                {s.metrics.map((m) => (
                  <div key={m.label}>
                    <dd className={`t-metric ${m.emphasis ? "text-accent" : ""}`}>{m.value}</dd>
                    <dt className="t-mono mt-0.5">{m.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link href={`/systems/${s.slug}`} className="link text-[13.5px]">
                  Read the write-up
                </Link>
                <a
                  href={s.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link text-[13.5px]"
                >
                  Source ↗
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
