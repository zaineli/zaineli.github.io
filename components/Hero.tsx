import Link from "next/link";
import { education, experience, links, profile, publications } from "@/lib/content";
import Reveal from "./Reveal";

/**
 * The name, two paragraphs, and a scannable summary column.
 *
 * The right column exists because the measure that keeps the bio readable
 * (~64ch) leaves half the grid empty at desktop widths, and because the first
 * thing most readers want is the four facts it holds rather than the prose.
 */
export default function Hero() {
  const previous = experience.slice(1).map((r) => r.company);
  const preprint = publications[0];

  return (
    <section className="w-full px-5 pb-4 pt-16 sm:px-8 md:pt-28">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
          <div>
            <Reveal>
              <p className="t-eyebrow">
                {profile.role} · {profile.company}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="t-name mt-6">{profile.name}</h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="t-lead mt-6 max-w-[54ch] text-fg-muted">{profile.standfirst}</p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 flex max-w-[64ch] flex-col gap-4">
                {profile.bio.map((p) => (
                  <p key={p.slice(0, 24)} className="t-body">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="pill"
                    {...(l.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  >
                    {l.label}
                    {l.external ? " ↗" : ""}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* At a glance, ordered by what someone scanning asks first. */}
          <Reveal delay={140}>
            <aside className="flex flex-col gap-6 border-t border-border-subtle pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1">
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
                  <Link href="/#publications" className="link">
                    {preprint.title.split(":")[0]}
                  </Link>
                  <br />
                  {preprint.status}
                </Field>
              ) : null}
            </aside>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <p className="t-mono mt-12 border-t border-border-subtle pt-5">
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
      <p className="t-small mt-2 leading-[1.7]">{children}</p>
    </div>
  );
}
