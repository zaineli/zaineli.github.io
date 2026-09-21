import { publications } from "@/lib/content";
import Reveal from "./Reveal";
import { Row } from "./Section";

export default function Publications() {
  return (
    <div className="flex flex-col">
      {publications.map((p, i) => (
        <Reveal key={p.title} delay={i * 50}>
          <Row
            index={String(i + 1).padStart(2, "0")}
            meta={
              <>
                <span className="block text-accent">{p.status.split(" · ")[0]}</span>
                <span className="mt-1 block">{p.year}</span>
                <span className="mt-1.5 block text-fg-faint">{p.venue}</span>
              </>
            }
            first={i === 0}
          >
            <h3 className="t-item-title max-w-[58ch]">{p.title}</h3>
            <p className="t-small mt-2">{p.authors}</p>
            <p className="t-body mt-3 max-w-[68ch]">{p.abstract}</p>

            {p.links?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="pill"
                    {...(l.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            ) : p.note ? (
              <p className="t-mono mt-4">{p.note}</p>
            ) : null}
          </Row>
        </Reveal>
      ))}
    </div>
  );
}
