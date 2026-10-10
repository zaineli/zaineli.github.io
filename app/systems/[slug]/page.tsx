import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import {
  SPEC_DECODE_HOLD,
  publications,
  shownLedger,
  shownReadouts,
  shownSections,
  systemBySlug,
  systems,
} from "@/lib/content";
import { slugify } from "@/lib/slug";
import { smart } from "@/lib/typo";
import CaseSection from "@/components/case/CaseSection";
import PrevNext from "@/components/case/PrevNext";
import Schematic from "@/components/Schematic";
import Arrow from "@/components/ui/Arrow";
import Num from "@/components/Num";
import SpecLine from "@/components/SpecLine";

export function generateStaticParams() {
  return systems.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const s = systemBySlug(slug);
  if (!s) return {};
  const held = SPEC_DECODE_HOLD ? s.held : undefined;
  const title = `${s.name} — ${held?.tagline ?? s.tagline}`;
  const description = held?.pitch ?? s.pitch;
  const url = `/systems/${s.slug}/`;
  // A shared case-study link previews as the case study, not the home page;
  // the site's card image is passed through from the root.
  const up = await parent;
  return {
    title,
    description,
    keywords: s.metaKeywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", images: up.openGraph?.images },
    twitter: { card: "summary_large_image", title, description, images: up.twitter?.images },
  };
}

const ARTICLE_ID = "case";

export default async function SystemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const system = systemBySlug(slug);
  if (!system) notFound();

  const held = SPEC_DECODE_HOLD ? system.held : undefined;
  const index = systems.findIndex((s) => s.slug === system.slug);
  const chain = [
    ...systems.map((s) => ({ href: `/systems/${s.slug}/`, name: s.name })),
    ...publications.map((p) => ({ href: `/papers/${p.slug}/`, name: p.shortTitle })),
  ];
  const prev = chain[(index - 1 + chain.length) % chain.length];
  const next = chain[(index + 1) % chain.length];

  const figures = [...system.figures, ...system.caseFigures];
  const ledger = shownLedger(system.ledger);
  const sections = shownSections(system);

  return (
    <article className="wrap case" id={ARTICLE_ID}>
      <p className="crumb">
        <a href="/#projects">← All projects</a>
      </p>
      <header className="page-head">
        <h1>{system.name}</h1>
        <p className="page-lede">{system.plain.line}</p>
        <div className="actions">
          <a className="btn btn-primary" href={system.repo} target="_blank" rel="noreferrer noopener">
            Code on GitHub <Arrow />
          </a>
          {ledger.length ? (
            <a className="btn" href={`/said-no/#no-${system.slug}`}>
              What didn’t work ({ledger.length})
            </a>
          ) : null}
        </div>
      </header>

      <div className="summary">
        <p className="num">
          {system.plain.num}
          {system.plain.vs ? <span className="vs">{system.plain.vs}</span> : null}
        </p>
        <p className="cap">{system.plain.cap}</p>
      </div>

      <section className="cs tech" aria-label="The technical write-up">
        <h2>The technical write-up</h2>
        <div className="body">
          <p className="lede">{smart(held?.abstract ?? system.abstract)}</p>
          <dl className="facts">
            {shownReadouts(system).map((r) => (
              <div key={r.label} className={r.negative ? "neg" : undefined}>
                <dt>
                  <Num value={r.value} />
                </dt>
                <dd>{r.label}</dd>
              </div>
            ))}
            <div>
              <dt className="sm">
                <SpecLine text={system.spec} />
              </dt>
              <dd>
                {system.year} · {system.thread}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Schematic schematic={system.schematic} label={system.name} />

      {sections.map((section) => {
        const id = slugify(section.heading);
        return (
          <CaseSection
            key={section.heading}
            section={section}
            own={system.name}
            figures={figures.filter((f) => f.section === id)}
            ledger={ledger.filter((e) => e.anchor === id)}
          />
        );
      })}

      <PrevNext prev={prev} next={next} />
    </article>
  );
}
