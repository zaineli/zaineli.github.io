import { interests } from "@/lib/content";
import Reveal from "./Reveal";
import { Row } from "./Section";

export default function Interests() {
  return (
    <div className="flex flex-col">
      {interests.map((it, i) => (
        <Reveal key={it.title} delay={i * 50}>
          <Row
            index={String(i + 1).padStart(2, "0")}
            meta={it.tag.split(" · ").map((t) => (
              <span key={t} className="block">
                {t}
              </span>
            ))}
            first={i === 0}
          >
            <h3 className="t-item-title">{it.title}</h3>
            <p className="t-body mt-2.5 max-w-[66ch]">{it.body}</p>
          </Row>
        </Reveal>
      ))}
    </div>
  );
}
