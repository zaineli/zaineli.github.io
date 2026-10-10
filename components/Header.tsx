import { profile } from "@/lib/content";

const SECTIONS = [
  { href: "/#how", label: "How I work" },
  { href: "/#work", label: "Work" },
  { href: "/#papers", label: "Papers" },
  { href: "/#record", label: "Record" },
  { href: "/#contact", label: "Contact" },
] as const;

/**
 * Who, as what, and five destinations, on one line over a hairline. Not
 * sticky, no scrolled state, no toggle. Plain anchors, so it ships no
 * JavaScript.
 */
export default function Header() {
  return (
    <header className="top g12">
      <a className="who" href="/">
        {profile.name}
      </a>
      <p className="role">
        {profile.role}, <span className="nw">{profile.company}</span>
      </p>
      <nav aria-label="Sections">
        {SECTIONS.map((s) => (
          <a key={s.href} href={s.href}>
            {s.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
