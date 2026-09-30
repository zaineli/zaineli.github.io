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
import CaseSection from "@/components/case/CaseSection";
import PrevNext from "@/components/case/PrevNext";
import ResultsMode from "@/components/case/ResultsMode";
import Schematic from "@/components/Schematic";
import KeepHyphens from "@/components/KeepHyphens";
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

/** A display number sized to its column: long readouts step down so they never overflow a major. */
const sizeOf = (v: string) => (v.length <= 7 ? "" : v.length <= 13 ? " mid" : " small");

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
    <article id={ARTICLE_ID} data-results="all">
      <div className="chero g12">
        <h1 className="cname">{system.name}</h1>
        <p className="ctag">
          <KeepHyphens text={held?.tagline ?? system.tagline} />
        </p>
      </div>

      <div className="plate g12">
        <div className="q1">
          <p className="k">
            {system.year} · {system.thread}
          </p>
          <p className="meta">
            <SpecLine text={system.spec} />
          </p>
          <p className="go">
            <a className="u" href={system.repo} target="_blank" rel="noreferrer noopener">
              Code
            </a>
          </p>
        </div>
        {shownReadouts(system).map((r, i) => (
          <div key={r.label} className={i === 0 ? "q2" : "q3"}>
            <p className={`num${r.negative ? " neg" : ""}${sizeOf(r.value)}`} {...(r.negative ? { "data-ink": "neg" } : {})}>
              <Num value={r.value} />
            </p>
            <p className="cap">
              <KeepHyphens text={r.label} />
            </p>
          </div>
        ))}
        <div className="q4">
          <p className="k">Show</p>
          <ResultsMode target={ARTICLE_ID} />
        </div>
      </div>

      <Schematic schematic={system.schematic} label={system.name} />

      <div className="g12">
        <p className="lede">{held?.abstract ?? system.abstract}</p>
      </div>

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
