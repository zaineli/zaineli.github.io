import { home, listings, negativeCount, profile, publications, systems } from "@/lib/content";
import { numberWord } from "./words";

/** three.js, self-hosted, mapped for /fig0.js. */
export const THREE_URL = "/vendor/three-0.160.0.module.min.js";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The first panel: the ceramic knot (Fig. 0, drawn by /fig0.js — the only
 * script the home page ships, with three.js) on its right; one sentence in
 * two weights at its lower left, and three facts in the corner.
 */
export default function Hero() {
  const facts = [
    [`${cap(numberWord(systems.length))} systems`, "built from scratch"],
    [`${cap(numberWord(publications.length + listings.length))} papers`, "one preprint, one in submission"],
    [`${negativeCount} results`, "that said no, published"],
  ];
  return (
    <>
      <section className="panel hero" aria-labelledby="headline">
        <div className="stage" data-stage="hero" aria-hidden="true">
          <canvas />
        </div>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <p className="kicker">
              Research engineer · {profile.role}, {profile.company}
            </p>
            <h1 id="headline">
              {home.lead} <span className="dim">{home.leadDim}</span>
            </h1>
          </div>
          <ul className="hero-facts">
            {facts.map(([b, rest]) => (
              <li key={b}>
                <b>{b}</b> {rest}
              </li>
            ))}
          </ul>
        </div>
        <script
          type="importmap"
          data-keep=""
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ imports: { three: THREE_URL } }),
          }}
        />
        <script type="module" src="/fig0.js" data-keep="" />
      </section>
    </>
  );
}
