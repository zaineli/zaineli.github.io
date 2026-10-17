import { home, listings, negativeCount, profile, publications, systems } from "@/lib/content";
import { numberWord } from "./words";

/** three.js, self-hosted, mapped for /fig0.js. */
export const THREE_URL = "/vendor/three-0.160.0.module.min.js";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The first panel: the ceramic knot (Fig. 0, drawn by /fig0.js — the only
 * script the home page ships, with three.js) on its right; one sentence in
 * two weights at its lower left (the setup grey, the claim ink), and three
 * facts in the corner.
 */
export default function Hero() {
  // The papers line counts each status as the data states it, so it cannot drift from the Papers rows.
  const statuses = [...publications.map((p) => p.tally ?? "preprint"), ...listings.map((l) => l.status.toLowerCase())];
  const tally = [...new Set(statuses)].map((st) => `${numberWord(statuses.filter((x) => x === st).length)} ${st}`);
  const facts = [
    [`${cap(numberWord(systems.length))} systems`, "built from scratch"],
    [`${cap(numberWord(publications.length + listings.length))} papers`, tally.join(", ")],
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
            {/* the setup in grey, the claim in ink */}
            <h1 id="headline">
              <span className="dim">{home.setup}</span> {home.claim}
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
