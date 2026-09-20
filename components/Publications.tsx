import { publications } from "@/lib/content";
import Reveal from "./Reveal";

export default function Publications() {
  return (
    <ol className="flex flex-col">
      {publications.map((p, i) => (
        <Reveal key={p.title} delay={i * 60}>
          <li
            className={`grid gap-x-10 gap-y-3 py-8 md:grid-cols-[minmax(0,13rem)_1fr] ${
              i === 0 ? "pt-0" : "border-t border-border-subtle"
            }`}
          >
            <div>
              <p className="t-mono">
                {String(i + 1).padStart(2, "0")} · {p.year}
              </p>
              <p className="t-mono mt-1 text-accent">{p.status}</p>
            </div>

            <div>
              <h3 className="t-item-title max-w-[60ch]">{p.title}</h3>
              <p className="t-small mt-1.5">{p.authors}</p>
              <p className="t-mono mt-1">{p.venue}</p>
              <p className="t-body mt-3 max-w-[66ch]">{p.abstract}</p>

              {p.links?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="pill"
                      {...(l.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              ) : p.note ? (
                <p className="t-mono mt-4">{p.note}</p>
              ) : null}
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
