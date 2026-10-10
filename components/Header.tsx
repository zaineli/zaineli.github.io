import { profile } from "@/lib/content";

const SECTIONS = [
  { href: "/#projects", label: "Projects" },
  { href: "/#paper", label: "Paper" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Name and role on the left, four destinations on the right. Plain anchors, no JavaScript. */
export default function Header() {
  return (
    <header className="wrap top">
      <div className="grid">
        <a className="id" href="/">
          <span className="id-name">{profile.name}</span>
          <span className="id-role">
            {profile.role} at {profile.company}
          </span>
        </a>
        <nav className="nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href}>
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
