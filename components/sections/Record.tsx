import { education, experience, priors, profile } from "@/lib/content";
import { portraitPlaceholder } from "@/lib/portrait";

/** His photo, where he lives in his own words, every role on one line, and where he studied. */
export default function Record() {
  const imo = priors.find((p) => p.label === "International Mathematical Olympiad");
  return (
    <section id="about" className="panel" aria-labelledby="h-about">
      <div className="wrap sec">
        <h2 className="eyebrow" id="h-about">
          About
        </h2>
        <div className="about">
          <figure className="portrait">
            <img
              src="/profile.webp"
              width={900}
              height={1015}
              alt="Zain Ali standing in front of a chalkboard"
              loading="lazy"
              decoding="async"
              style={{ backgroundImage: `url(${portraitPlaceholder})` }}
            />
          </figure>
          <div className="about-text">
            <p className="lives">{profile.lives}</p>
            <ol className="roles">
              {experience.map((r, i) => (
                <li key={r.company}>
                  <span className="when">{r.period}</span>
                  <span className="who">
                    {r.company} <span>{r.title}</span>
                  </span>
                  <span className="v">{i === 0 ? "" : r.outcomes[0]?.value}</span>
                </li>
              ))}
            </ol>
            <p className="edu">
              {education.short}, {education.degree}, {education.period}. {education.plain}
              {imo ? ` ${imo.rank.charAt(0).toUpperCase()}${imo.rank.slice(1)} at the ${imo.label}.` : null}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
