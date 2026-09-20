import { interests } from "@/lib/content";
import Reveal from "./Reveal";

export default function Interests() {
  return (
    <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
      {interests.map((it, i) => (
        <Reveal key={it.title} delay={i * 60}>
          <article>
            <h3 className="t-item-title">{it.title}</h3>
            <p className="t-mono mt-1.5">{it.tag}</p>
            <p className="t-body mt-3 max-w-[54ch]">{it.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
