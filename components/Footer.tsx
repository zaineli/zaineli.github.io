import { education, links, profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="mt-24 border-t border-border-subtle md:mt-32"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8 md:py-16">
        <h2 className="t-eyebrow">Contact</h2>
        <p className="t-lead mt-5 max-w-[46ch]">
          Open to conversations about reinforcement learning, agent memory, and inference
          systems — research collaborations included.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link text-[14px]"
              {...(l.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            >
              {l.label}
              {l.external ? " ↗" : ""}
            </a>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border-subtle pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="t-mono">
            {education.degree} · {education.school.split("(")[1]?.replace(")", "") ?? education.school} ·{" "}
            {education.period}
          </p>
          <p className="t-mono">© {new Date().getFullYear()} {profile.name}</p>
        </div>
      </div>
    </footer>
  );
}
