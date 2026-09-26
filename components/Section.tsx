import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * One page section: a mono eyebrow, an optional serif title and italic intro,
 * and the content inside a translucent panel.
 *
 * The panel matters. Without a container every section floats on flat
 * background and the page reads as one undifferentiated column — which is
 * exactly how the first version of this site looked. A bordered, slightly
 * translucent surface gives each section an edge and lets the hero graphic
 * show through behind it.
 */
export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`w-full px-5 py-10 sm:px-8 md:py-14 ${className}`}>
      <div className="mx-auto w-full max-w-[1100px]">
        <Reveal>
          <h2 className="t-eyebrow">{eyebrow}</h2>
        </Reveal>

        <div className="panel mt-5 px-5 py-8 sm:px-8 md:px-10 md:py-10">
          {title || intro ? (
            <Reveal>
              {title ? <p className="t-section max-w-[22ch]">{title}</p> : null}
              {intro ? <p className="t-lead mt-4 max-w-[68ch]">{intro}</p> : null}
              <div className="rule mt-8" />
            </Reveal>
          ) : null}
          <div className={title || intro ? "mt-8" : ""}>{children}</div>
        </div>
      </div>
    </section>
  );
}

/**
 * The three-column row used by every list on the page: a faint index, a mono
 * meta column, and the content. Ahmed's publication list is the reference —
 * the index and meta columns give the eye a fixed left edge to scan, which a
 * stacked list does not.
 */
export function Row({
  index,
  meta,
  children,
  first = false,
}: {
  index?: string;
  meta?: ReactNode;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <article
      className={`grid gap-x-8 gap-y-3 py-7 md:grid-cols-[2.5rem_minmax(0,9rem)_1fr] ${
        first ? "pt-0" : "rule"
      }`}
    >
      <p className="t-mono hidden text-fg-faint md:block">{index}</p>
      <div className="t-mono">{meta}</div>
      <div className="min-w-0">{children}</div>
    </article>
  );
}
