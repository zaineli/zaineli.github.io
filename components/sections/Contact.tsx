import { links, profile } from "@/lib/content";

const ORDER = ["Email", "GitHub", "LinkedIn"];

/** The last word, then three ways to reach him. */
export default function Contact() {
  const shown = ORDER.map((label) => links.find((l) => l.label === label)).filter(
    (l): l is (typeof links)[number] => l !== undefined,
  );
  const where = (href: string) => href.replace(/^mailto:/, "").replace(/^https?:\/\/(www\.)?/, "");

  return (
    <section className="sec contact" id="contact" aria-labelledby="h-contact">
      <header className="sh g12">
        <h2 id="h-contact">Contact</h2>
      </header>
      <div className="g12">
        <p className="closer">
          {profile.closer.split(/(?<=\.) /).map((line) => (
            <span key={line}>{line} </span>
          ))}
        </p>
      </div>
      <div className="ways g12">
        {shown.map((l) => (
          <p key={l.label} className="way">
            <span className="k">{l.label}</span>
            <a className="u" href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
              {where(l.href)}
            </a>
          </p>
        ))}
      </div>
    </section>
  );
}
