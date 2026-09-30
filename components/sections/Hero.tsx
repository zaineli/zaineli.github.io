import { profile } from "@/lib/content";
import { portraitPlaceholder } from "@/lib/portrait";

/**
 * The title block. The conviction set like a paper's title — the doubt in
 * the display cut at book weight, the conviction at semibold — his face
 * beside it, and under a rule his two standing sentences: how he works and
 * where he lives. Nothing here is a claim that needs a number; the numbers
 * start in the next section.
 */
export default function Hero() {
  const [a, b, c] = profile.manifestoLines;
  return (
    <section className="hero g12" aria-labelledby="thesis">
      <h1 className="thesis" id="thesis">
        <span>{a}</span> <span>{b}</span> <span className="s2">{c}</span>
      </h1>
      <figure className="portrait" style={{ backgroundImage: `url(${portraitPlaceholder})` }}>
        <img
          src="/profile.webp"
          width={900}
          height={1015}
          alt="Zain Ali in front of a chalkboard of handwritten equations"
          fetchPriority="high"
          decoding="async"
        />
      </figure>
      <div className="stand">
        <p className="method">{profile.method}</p>
        <p className="lives">{profile.lives}</p>
      </div>
    </section>
  );
}
