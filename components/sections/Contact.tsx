import { home, links } from "@/lib/content";
import Arrow from "@/components/ui/Arrow";

/** One line, the email as large as a headline, and the two other places to find him. */
export default function Contact() {
  const email = links.find((l) => l.label === "Email")!;
  const rest = links.filter((l) => l.label !== "Email");
  return (
    <section id="contact" className="panel contact" aria-labelledby="h-contact">
      <div className="wrap sec">
        <h2 className="eyebrow" id="h-contact">
          {home.contactLine}
        </h2>
        <a className="mail" href={email.href}>
          {/* a phone breaks the address at the @, not mid-word */}
          {(() => {
            const [user, domain] = email.href.replace(/^mailto:/, "").split("@");
            return (
              <>
                {user}
                <wbr />@{domain}
              </>
            );
          })()}
        </a>
        <div className="links">
          {rest.map((l) => (
            <a key={l.label} className="go" href={l.href} target="_blank" rel="noreferrer noopener">
              {l.label} <Arrow />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
