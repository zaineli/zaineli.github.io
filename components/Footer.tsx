import { profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="wrap foot">
      <p>© 2026 {profile.name}</p>
    </footer>
  );
}
