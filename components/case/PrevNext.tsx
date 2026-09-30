export interface Neighbour {
  href: string;
  name: string;
}

/** The closed ring through the four systems and the paper, between two heavy rules. */
export default function PrevNext({ prev, next }: { prev: Neighbour; next: Neighbour }) {
  return (
    <nav className="pn g12" aria-label="Other write-ups">
      <p className="q1">
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
