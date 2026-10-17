export interface Neighbour {
  href: string;
  name: string;
}

/** The closed ring through the selected systems and the paper (components/case/Ring.ts). */
export default function PrevNext({ prev, next }: { prev: Neighbour; next: Neighbour }) {
  return (
    <nav className="pn" aria-label="Other write-ups">
      <p className="pv">
        <span className="k">Previous</span>
        <a href={prev.href}>{prev.name}</a>
      </p>
      <p className="nx">
        <span className="k">Next</span>
        <a href={next.href}>{next.name}</a>
      </p>
    </nav>
  );
}
