import { profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p>© 2026 {profile.name}</p>
        <p>Every number on this site is one someone could check.</p>
      </div>
    </footer>
  );
}
