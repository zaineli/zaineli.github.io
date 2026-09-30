import { links } from "@/lib/content";

const ORDER = ["Email", "GitHub", "LinkedIn"];

/** Three ways to reach him, set large, each with where it goes beneath. */
export default function Contact() {
  const shown = ORDER.map((label) => links.find((l) => l.label === label)).filter(
    (l): l is (typeof links)[number] => l !== undefined,
  );
  const where = (href: string) => href.replace(/^mailto:/, "").replace(/^https?:\/\/(www\.)?/, "");

  return (
    <section className="sec" id="contact" aria-labelledby="h-contact">
      <div className="sh g12">
        <h2 id="h-contact">Contact</h2>
      </div>
      <div className="contact g12">
        {shown.map((l) => (
          <p key={l.label} className="ct">
            <a href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
              {l.label}
            </a>
            <small>{where(l.href)}</small>
          </p>
        ))}
      </div>
    </section>
  );
}
