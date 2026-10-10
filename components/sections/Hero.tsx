import { profile } from "@/lib/content";
import { portraitPlaceholder } from "@/lib/portrait";

/**
 * The opening: his own three sentences about what machines cannot do, set
 * as one statement, the last word in italic and its full stop in oxblood.
 * Under a hairline, what he is building; beside it, the bet he is known
 * for and what he does about it. His face to the right, with where he
 * lives in his own words.
 */
export default function Hero() {
  const [a, b, c] = profile.opening;
  return (
    <section className="hero g12" aria-labelledby="opening">
      <h1 className="opening" id="opening">
        <span>{a}</span> <span>{b}</span>{" "}
        <span>
          {c} <em>{profile.openingWord}</em>
          <span className="stop">.</span>
        </span>
      </h1>
      <figure className="portrait">
        <img
          style={{ backgroundImage: `url(${portraitPlaceholder})` }}
          src="/profile.webp"
          width={900}
          height={1015}
          alt="Zain Ali in front of a chalkboard of handwritten equations"
          fetchPriority="high"
          decoding="async"
        />
        <figcaption>{profile.lives}</figcaption>
      </figure>
      <div className="stand">
        <p className="building">{profile.building}</p>
        <div className="bet">
          <p className="claim">
            {profile.manifesto.split(/(?<=\.) /).map((line) => (
              <span key={line}>{line} </span>
            ))}
          </p>
          <p className="how">{profile.bet}</p>
        </div>
      </div>
    </section>
  );
}
