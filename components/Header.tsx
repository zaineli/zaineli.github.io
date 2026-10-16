import { profile } from "@/lib/content";

/** The home page's sections, in page order. */
export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "papers", label: "Papers" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

/** His name on the left, four places to go on the right. Plain anchors, no JavaScript. */
export default function Header() {
  return (
    <header className="top">
      <div className="wrap">
        <a className="id" href="/">
          {profile.name}
        </a>
        <nav className="nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`/#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
