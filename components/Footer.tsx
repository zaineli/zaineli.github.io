import { profile } from "@/lib/content";

/** The rule, stated once, at the foot of every page. */
export default function Footer() {
  return (
    <footer className="foot g12">
      <p className="who">{profile.name}</p>
      <p className="rule-line">{profile.discipline}</p>
    </footer>
  );
}
