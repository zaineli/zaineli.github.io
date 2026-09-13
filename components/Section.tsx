import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * One page section: a mono eyebrow, an optional serif title, and content on a
 * shared 1100px measure. Every section on the site uses this so the vertical
 * rhythm and left edge never drift.
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
    <section id={id} className={`w-full px-5 py-16 sm:px-8 md:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-[1100px]">
        <Reveal>
          <h2 className="t-eyebrow">{eyebrow}</h2>
          {title ? <p className="t-section mt-5 max-w-[24ch]">{title}</p> : null}
          {intro ? <p className="t-lead mt-4 max-w-[62ch]">{intro}</p> : null}
        </Reveal>
        <div className={title || intro ? "mt-10 md:mt-14" : "mt-8 md:mt-10"}>{children}</div>
      </div>
    </section>
  );
}
