import { links, profile } from "@/lib/content";
import { portraitPlaceholder } from "@/lib/portrait";
import Arrow from "@/components/ui/Arrow";

const href = (label: string) => links.find((l) => l.label === label)?.href ?? "#";

/** The headline, one line under it, three ways to reach him, and where he is now — beside his photo. */
export default function Hero() {
  const lines = profile.headline;
  return (
    <section className="wrap hero" aria-labelledby="headline">
      <div className="grid">
        <div className="hero-text">
          <div className="hero-top">
            <h1 id="headline">
              {lines.map((l, i) => (
                <span key={l} className="l">
                  {l}
                  {i < lines.length - 1 ? " " : <span className="stop">.</span>}
                </span>
              ))}
            </h1>
            <p className="lede">{profile.lede}</p>
            <div className="actions">
              <a className="btn btn-primary" href={href("Email")}>
                Email me
              </a>
              <a className="btn" href={href("GitHub")} target="_blank" rel="noreferrer noopener">
                GitHub <Arrow />
              </a>
              <a className="btn" href={href("LinkedIn")} target="_blank" rel="noreferrer noopener">
                LinkedIn <Arrow />
              </a>
            </div>
          </div>
          <p className="now">
            <span className="dot" aria-hidden="true" />
            <span>
              <strong>Now at {profile.company}.</strong> {profile.now}
            </span>
          </p>
        </div>
        <figure className="portrait">
          <img
            src="/profile.webp"
            width={900}
            height={1015}
            alt="Zain Ali standing in front of a chalkboard"
            fetchPriority="high"
            decoding="async"
            style={{ backgroundImage: `url(${portraitPlaceholder})` }}
          />
        </figure>
      </div>
    </section>
  );
}
