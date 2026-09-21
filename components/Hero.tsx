import Link from "next/link";
import { education, experience, links, profile, publications } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MailIcon, ScholarIcon } from "./icons";
import Reveal from "./Reveal";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Email: MailIcon,
  Scholar: ScholarIcon,
};

/**
 * The name, the standfirst, the manifesto line, and the field graphic.
 *
 * The graphic is not decoration bought from a stock library: it is 72 episodes
 * of real dentate-gyrus sparse codes from the engram benchmark, each column an
 * episode and each mark an active unit, with units ordered by which episode
 * first recruited them. The diagonal edge is neurogenesis allocating fresh
 * units to novel input; the scatter to its right is reuse. It is the mechanism
 * the memory architecture is built on, drawn from its own output.
 *
 * It is sized and positioned relative to the content column, not the section,
 * so the composition — art behind content, card floating over it — holds at
 * every width instead of drifting off-canvas as the viewport changes.
 */
export default function Hero() {
  const previous = experience.slice(1).map((r) => r.company);
  const preprint = publications[0];

  return (
    <section className="relative w-full overflow-hidden px-5 pb-10 pt-14 sm:px-8 md:pt-24">
      <div className="relative mx-auto w-full max-w-[1100px]">
        {/* Bleeds past the column's right edge, behind the card and the tail
            of the prose. The section clips it at the viewport edge. */}
        <div
          aria-hidden="true"
          className="graphic absolute -right-10 -top-20 hidden h-[1180px] w-[68%] max-w-[760px] select-none lg:block"
        />

        <div className="relative z-10 grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]">
          <div>
            <Reveal>
              <p className="t-eyebrow">
                {profile.role} · {profile.company}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="t-name mt-7">
                {profile.name.split(" ").map((w) => (
                  <span key={w} className="block">
                    {w}
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={110}>
              <p className="t-lead mt-7 max-w-[48ch]">{profile.standfirst}</p>
            </Reveal>

            {/* The conviction line. Larger and upright, not italic, so it
                reads as a claim rather than as framing — everything else
                here says what the work is; this says why it's worth doing. */}
            <Reveal delay={155}>
              <p className="t-manifesto mt-6 max-w-[46ch] border-l-2 border-accent py-0.5 pl-5">
                {profile.manifesto}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-7 flex max-w-[58ch] flex-col gap-4">
                {profile.bio.map((p) => (
                  <p key={p.slice(0, 24)} className="t-body">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex items-center gap-4">
                  {links.map((l) => {
                    const Icon = ICONS[l.label];
                    if (!Icon) return null;
                    return (
                      <a
                        key={l.href}
                        href={l.href}
                        aria-label={l.label}
                        title={l.label}
                        className="text-fg-subtle transition-colors hover:text-accent"
                        {...(l.external
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </a>
                    );
                  })}
                </div>
                <span className="hidden h-4 w-px bg-border-default sm:block" aria-hidden="true" />
                <div className="flex flex-wrap items-center gap-2">
                  <a href={publications[0] ? "#publications" : "#systems"} className="pill">
                    Preprint ↗
                  </a>
                  <a
                    href="https://github.com/zaineli"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="pill"
                  >
                    github.com/zaineli ↗
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* At a glance, ordered by what someone scanning asks first. */}
          <Reveal delay={160}>
            {/* On a panel, not bare: the field graphic runs behind this column
                and unlifted text sitting directly on it is unreadable. */}
            <aside className="panel flex flex-col gap-6 px-5 py-6 shadow-[var(--shadow-card)] lg:px-6">
              <Field label="Currently">
                <span className="text-fg">{profile.company}</span>
                <br />
                {profile.role}
                <br />
                {profile.location}
              </Field>

              <Field label="Previously">{previous.join(" · ")}</Field>

              <Field label="Education">
                {education.degree}
                <br />
                {education.school.replace(/\s*\(.*\)$/, "")}
                <br />
                {education.period}
              </Field>

              {preprint ? (
                <Field label="Latest">
                  <Link href="/#publications" className="link text-accent">
                    {preprint.title.split(":")[0]}
                  </Link>
                  <br />
                  {preprint.status}
                </Field>
              ) : null}
            </aside>
          </Reveal>
        </div>

        <Reveal delay={320}>
          <p className="t-mono relative z-10 mt-12 border-t border-border-subtle pt-5">
            {profile.focus.join("  ·  ")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="t-eyebrow text-fg-faint">{label}</p>
      <p className="t-small mt-2 leading-[1.65]">{children}</p>
    </div>
  );
}
