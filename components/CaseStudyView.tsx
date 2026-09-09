import Link from "next/link";
import type { ReactNode } from "react";
import type { CaseStudy, CaseSection } from "@/lib/content";
import MetaTable, { type MetaRow } from "./MetaTable";
import ProjectVisual from "./ProjectVisual";
import ProjectMedia from "./ProjectMedia";
import Reveal from "./Reveal";
import ScrollProgress from "./ScrollProgress";
import { ArrowUpRight, ArrowRight } from "./icons";

export default function CaseStudyView({ study, topSlot }: { study: CaseStudy; topSlot?: ReactNode }) {
  const rows: MetaRow[] = [
    { label: "Year", value: study.year },
    { label: "Role", value: study.role },
    { label: "Scope", value: study.scope.join(", ") },
    { label: "Device", value: study.device },
    { label: "Tools", value: study.tools.join(", ") },
  ];
  if (study.links && study.links.length > 0) {
    rows.push({
      label: study.links.length > 1 ? "Links" : "Link",
      value: (
        <span className="flex flex-col gap-1.5">
          {study.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="link-underline inline-flex w-fit items-center gap-1 text-[var(--accent)]"
            >
              {l.label}
              <ArrowUpRight />
            </a>
          ))}
        </span>
      ),
    });
  }

  return (
    <article className="flex w-full flex-col items-center gap-[64px] md:gap-[96px]">
      <ScrollProgress />
      {/* Header */}
      <header className="w-full px-5 sm:px-8 lg:px-[80px]">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/#work"
            data-cursor="pointer"
            className="group/back t-link inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowRight className="rotate-180 transition-transform duration-200 group-hover/back:-translate-x-1" />
            Work
          </Link>

          {study.draft && (
            <div className="mt-5 rounded-[var(--radius-md)] border border-dashed border-border-strong bg-[var(--tag-bg)] px-4 py-3">
              <p className="t-meta text-fg-muted">
                <span className="text-fg">Draft.</span> Placeholders marked{" "}
                <code className="font-[family-name:var(--font-dm-mono)] text-[var(--accent)]">[[…]]</code> need your
                input. Real metrics, screenshots, and the specifics only you know.
              </p>
            </div>
          )}

          <Reveal className="mt-6">
            <p className="t-eyebrow text-fg-subtle">{study.role}</p>
            <h1 className="t-display-lg mt-3 max-w-[820px]">{study.title}</h1>
            <p className="t-body mt-4 max-w-[680px] text-fg-muted">{study.tagline}</p>
          </Reveal>

          <Reveal className="mt-8" delay={80}>
            <div
              className="relative aspect-[839/440] w-full overflow-hidden rounded-[16px] border border-border-default"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="media-scale-in relative h-full w-full">
                {study.heroMedia ? (
                  <ProjectMedia media={study.heroMedia} sizes="(min-width: 1280px) 1200px, 100vw" priority />
                ) : (
                  <ProjectVisual name={study.title} hueFrom={study.hueFrom} hueTo={study.hueTo} size="hero" />
                )}
              </div>
            </div>
          </Reveal>

          <div className="mt-8 max-w-[680px]">
            <MetaTable rows={rows} />
          </div>
        </div>
      </header>

      {/* Optional top slot — e.g. a full-width architecture diagram */}
      {topSlot && (
        <div className="w-full px-5 sm:px-8 lg:px-[80px]">
          <div className="mx-auto max-w-[1280px]">{topSlot}</div>
        </div>
      )}

      {/* Sections */}
      <div className="w-full px-5 sm:px-8 lg:px-[80px]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-[64px] md:gap-[88px]">
          {study.sections.map((s) => (
            <Reveal key={s.no} as="section">
              <Section section={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}

function Section({ section: s }: { section: CaseSection }) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-[44px]">
      <div className="flex items-center gap-3 md:sticky md:top-24 md:h-fit md:w-[140px] md:shrink-0 md:flex-col md:items-start md:gap-2 md:self-start">
        <span className="t-mono-xs text-fg-subtle">{s.no}</span>
        <span className="t-eyebrow text-fg-muted">{s.kicker}</span>
      </div>

      <div className="max-w-[760px] flex-1">
        <h2 className="t-display">{s.heading}</h2>

        {s.body && (
          <div className="mt-4 flex flex-col gap-4">
            {s.body.map((p, i) => (
              <p key={i} className="t-body text-fg-muted">
                {renderInline(p)}
              </p>
            ))}
          </div>
        )}

        {s.decisions && (
          <div className="mt-6 flex flex-col gap-7">
            {s.decisions.map((d, i) => (
              <div key={i}>
                <h3 className="t-subhead">{d.title}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {d.items.map((it, j) => (
                    <li key={j} className="t-body flex gap-3 text-fg-muted">
                      <span className="mt-[10px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                      <span>{renderInline(it)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {s.shipped && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {s.shipped.map((item, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-lg)] border border-border-default bg-bg-elevated p-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <h3 className="t-meta text-fg">{item.title}</h3>
                <p className="t-project-body mt-2 text-fg-muted">{renderInline(item.caption)}</p>
              </div>
            ))}
          </div>
        )}

        {s.stats && (
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {s.stats.map((st, i) => (
              <div key={i} className="border-t border-border-row pt-4">
                <p className="t-mono-xs text-fg-subtle">{st.label}</p>
                <p className="t-subhead mt-2">{renderInline(st.value)}</p>
              </div>
            ))}
          </div>
        )}

        {s.maxims && (
          <div className="mt-6 flex flex-col gap-4">
            {s.maxims.map((m, i) => (
              <p key={i} className="t-display flex items-baseline gap-3">
                <span className="t-mono-xs text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                <span>{m}</span>
              </p>
            ))}
          </div>
        )}

        {s.roadmap && (
          <ul className="mt-6 flex flex-col">
            {s.roadmap.map((r, i) => (
              <li key={i} className="flex items-baseline gap-4 border-t border-border-row py-3">
                <span className="t-mono-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-body text-fg-muted">{renderInline(r)}</span>
              </li>
            ))}
          </ul>
        )}

        {s.figures && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {s.figures.map((fig, i) => {
              const plated = fig.plate === "light";
              return (
                <figure key={i} className={fig.wide ? "sm:col-span-2" : ""}>
                  <div
                    className={`w-full overflow-hidden rounded-[var(--radius-lg)] border border-border-default ${
                      plated ? "bg-white p-3 sm:p-4" : "bg-bg-muted"
                    }`}
                    style={{ aspectRatio: fig.ratio ?? "16 / 9", boxShadow: "var(--shadow-card)" }}
                  >
                    <div className={`relative h-full w-full ${plated ? "overflow-hidden rounded-[8px]" : ""}`}>
                      <ProjectMedia
                        media={fig.media}
                        sizes={fig.wide ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                      />
                    </div>
                  </div>
                  {fig.caption && <figcaption className="t-project-body mt-3 text-fg-subtle">{fig.caption}</figcaption>}
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/** Render [[editor notes]] as a subtle highlighted span so drafts read clearly. */
function renderInline(text: string) {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("[[") && part.endsWith("]]")) {
      return (
        <mark
          key={i}
          className="rounded bg-[var(--tag-bg)] px-1 text-fg-subtle [font-style:italic]"
        >
          {part.slice(2, -2)}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
