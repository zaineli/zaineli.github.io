import { links } from "@/lib/content";
import Arrow from "@/components/ui/Arrow";

/** The email, large, and the two other places to find him. */
export default function Contact() {
  const email = links.find((l) => l.label === "Email")!;
  const rest = links.filter((l) => l.label !== "Email");
  return (
    <section id="contact" className="wrap sec contact" aria-labelledby="h-contact">
      <div className="grid">
        <h2 className="sec-title" id="h-contact">
          Contact
        </h2>
        <div className="sec-body">
          <a className="mail" href={email.href}>
            {email.href.replace(/^mailto:/, "")}
          </a>
          <div className="actions">
            {rest.map((l) => (
              <a key={l.label} className="btn" href={l.href} target="_blank" rel="noreferrer noopener">
                {l.label} <Arrow />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
