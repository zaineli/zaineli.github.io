import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { systemBySlug, systems } from "@/lib/content";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return systems.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = systemBySlug(slug);
  if (!s) return {};
  return { title: `${s.name} — ${s.tagline}`, description: s.abstract };
}

export default async function SystemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = systemBySlug(slug);
  if (!s) notFound();

  return (
    <article className="w-full px-5 pb-16 pt-14 sm:px-8 md:pt-20">
      <div className="mx-auto w-full max-w-[1100px]">
        <Reveal>
          <Link href="/#systems" className="t-mono transition-colors hover:text-accent">
            ← Systems
          </Link>
        </Reveal>

        {/* One panel for the whole write-up, matching the home page's
            visual language rather than dropping back to plain paragraphs —
            the graphic bleeds behind the header only, quiet enough not to
            compete with a long read. */}
        <div className="panel relative mt-5 overflow-hidden px-5 py-8 sm:px-8 md:px-10 md:py-10">
          <div
            aria-hidden="true"
            className="graphic graphic-quiet absolute -right-16 -top-24 hidden h-[560px] w-[44%] max-w-[440px] select-none lg:block"
          />

          <header className="relative z-10 border-b border-border-subtle pb-10">
            <Reveal delay={60}>
              <h1 className="t-section text-[clamp(2rem,5vw,2.75rem)]">{s.name}</h1>
              <p className="t-lead mt-3 max-w-[56ch]">{s.tagline}</p>
            </Reveal>

            <Reveal delay={120}>
              <p className="t-body mt-6 max-w-[68ch]">{s.abstract}</p>
            </Reveal>

            <Reveal delay={180}>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                {s.metrics.map((m) => (
                  <div key={m.label}>
                    <dd className={`t-metric text-[15px] ${m.emphasis ? "text-accent" : ""}`}>
                      {m.value}
                    </dd>
                    <dt className="t-mono mt-0.5">{m.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-wrap items-center gap-2">
                <a href={s.repo} target="_blank" rel="noreferrer noopener" className="pill">
                  Source ↗
                </a>
                {s.tags.map((t) => (
                  <span key={t} className="pill">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </header>

          <div className="relative z-10 flex flex-col">
            {s.sections.map((sec, i) => (
              <Reveal key={sec.heading} delay={i * 40}>
                <section className="border-b border-border-subtle py-10 last:border-b-0 md:py-12">
                  <h2 className="t-eyebrow">{sec.heading}</h2>

                  {sec.paragraphs?.length ? (
                    <div className="mt-5 flex flex-col gap-4">
                      {sec.paragraphs.map((p) => (
                        <p key={p.slice(0, 24)} className="t-body max-w-[68ch]">
                          {p}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {sec.table ? (
                    <figure className="mt-7">
                      <div className="scroll-x -mx-5 px-5 sm:mx-0 sm:px-0">
                        <table className="t-table w-full min-w-[34rem] border-collapse text-left">
                          <thead>
                            <tr className="border-b border-border-default">
                              {sec.table.head.map((h, j) => (
                                <th
                                  key={`${h}-${j}`}
                                  scope="col"
                                  className={`py-2 pr-6 font-medium text-fg-subtle ${
                                    j === 0 ? "" : "text-right"
                                  }`}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sec.table.rows.map((row) => {
                              const isTotal = row[0] === "overall";
                              return (
                                <tr
                                  key={row.join("|")}
                                  className={`border-b border-border-subtle last:border-b-0 ${
                                    isTotal ? "font-medium text-fg" : ""
                                  }`}
                                >
                                  {row.map((cell, j) => (
                                    <td
                                      key={`${cell}-${j}`}
                                      className={`py-2 pr-6 ${
                                        j === 0 ? "text-fg-muted" : "text-right"
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {sec.table.caption ? (
                        <figcaption className="t-mono mt-3">{sec.table.caption}</figcaption>
                      ) : null}
                    </figure>
                  ) : null}

                  {sec.list?.length ? (
                    <dl className="mt-6 flex flex-col gap-5">
                      {sec.list.map((item) => (
                        <div key={item.term}>
                          <dt className="t-item-title">{item.term}</dt>
                          <dd className="t-body mt-1.5 max-w-[68ch]">{item.detail}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
