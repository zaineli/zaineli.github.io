import { profile } from "@/lib/content";

/** The foot of every page: his name, and the joke he ends his own profile on. */
export default function Footer() {
  return (
    <footer className="foot g12">
      <p className="who">{profile.name}</p>
      <p className="aside">{profile.aside}</p>
    </footer>
  );
}
