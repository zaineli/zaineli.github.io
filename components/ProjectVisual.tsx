import { Asterisk } from "./icons";

interface Props {
  name: string;
  hueFrom: string;
  hueTo: string;
  /** big = case-study hero; default = card */
  size?: "card" | "hero";
}

/**
 * Placeholder visual for a project until a real screenshot is dropped in.
 * Tasteful gradient + grid + ghosted label, themed per-project. Replace by
 * swapping this for a next/image once assets exist.
 */
export default function ProjectVisual({ name, hueFrom, hueTo, size = "card" }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-muted">
      {/* gradient blobs */}
      <div
        className="absolute inset-0 opacity-[0.55] dark:opacity-40"
        style={{
          backgroundImage: `radial-gradient(120% 120% at 22% 18%, ${hueFrom}55 0%, transparent 55%), radial-gradient(120% 120% at 85% 95%, ${hueTo}4d 0%, transparent 55%)`,
        }}
      />
      {/* fine grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: size === "hero" ? "48px 48px" : "32px 32px",
        }}
      />
      {/* ghost ornament */}
      <Asterisk
        className="absolute -right-6 -top-8 text-fg opacity-[0.06]"
        style={{ width: size === "hero" ? 240 : 160, height: size === "hero" ? 240 : 160 }}
      />
      {/* label */}
      <div className="absolute bottom-0 left-0 flex items-center gap-2 p-4 sm:p-5">
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: hueFrom }} aria-hidden="true" />
        <span className="t-mono-xs text-fg-subtle">{name}</span>
      </div>
    </div>
  );
}
