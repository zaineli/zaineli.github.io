import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { SPEC_DECODE_HOLD, shownLedger, systemBySlug, systems, techPath, type System } from "@/lib/content";
import { smart } from "@/lib/typo";
import Figure from "@/components/fig/Figure";
import LongWriteup from "@/components/case/LongWriteup";
import PrevNext from "@/components/case/PrevNext";
import { around } from "@/components/case/Ring";
import Schematic from "@/components/Schematic";
import Arrow from "@/components/ui/Arrow";
import Num from "@/components/Num";

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

/** The page head every system page shares: the name, the question, where it stands, and where to go next. */
function Head({ system, brief }: { system: System; brief: boolean }) {
  const ledger = shownLedger(system.ledger);
  const open = system.repoPublic !== false;
  return (
    <header className="page-head">
      <h1>{system.name}</h1>
      <p className="page-lede">{brief ? system.question : system.plain.line}</p>
      {brief && system.status ? <p className="standing">{system.status}</p> : null}
      <div className="actions">
        {open ? (
          <a className="btn btn-primary" href={system.repo} target="_blank" rel="noreferrer noopener">
            Code on GitHub <Arrow />
          </a>
        ) : null}
        {brief ? (
          <a className={`btn${open ? "" : " btn-primary"}`} href={techPath(system)}>
            The full technical write-up
          </a>
        ) : null}
        {ledger.length ? (
          <a className="btn" href={`/said-no/#no-${system.slug}`}>
            What didn’t work · {ledger.length}
          </a>
        ) : null}
      </div>
      {open ? null : <p className="pending">Code, preregistration and every transcript go public with the preprint.</p>}
    </header>
  );
}

function Summary({ system }: { system: System }) {
  return (
    <div className="summary">
      <p className="num">
        {system.plain.num}
        {system.plain.vs ? <span className="vs">{system.plain.vs}</span> : null}
      </p>
      <p className="cap">{system.plain.cap}</p>
    </div>
  );
}

export default async function SystemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const system = systemBySlug(slug);
  if (!system) notFound();
  const ring = around(`/systems/${system.slug}/`);
  const b = system.brief;

  // Archived work: the long write-up on its own page, as it always was.
  if (!b) {
    return (
      <article className="wrap case" id="case">
        <p className="crumb">
          <a href="/#work">← All work</a>
        </p>
        <Head system={system} brief={false} />
        <Summary system={system} />
        <LongWriteup system={system} />
        {ring ? <PrevNext prev={ring.prev} next={ring.next} /> : null}
      </article>
    );
  }

  // Selected work: the brief. Four parts, three numbers, one figure, the mechanism.
  const fig = [...system.figures, ...system.caseFigures].find((f) => f.id === b.figure);
  const parts: [string, string, boolean?][] = [
    ["The question", b.question],
    ["What I built", b.built],
    ["What I found", b.found],
    ["What it does not show", b.limits, true],
  ];
  return (
    <article className="wrap case brief" id="case">
      <p className="crumb">
        <a href={`/#${system.slug}`}>← All work</a>
      </p>
      <Head system={system} brief />
      <Summary system={system} />

      <section className="bf" aria-label="In brief">
        {parts.map(([h, text, lim]) => (
          <div key={h} className={lim ? "bf-part lim" : "bf-part"}>
            <h2>{h}</h2>
            <p>{smart(text)}</p>
          </div>
        ))}
      </section>

      <dl className="facts bf-nums">
        {b.numbers.map((r) => (
          <div key={r.label} className={r.negative ? "neg" : undefined}>
            <dt>
              <Num value={r.value} />
            </dt>
            <dd>{r.label}</dd>
          </div>
        ))}
      </dl>

      {fig ? (
        <section className="bf-fig" aria-label="The result, as a figure">
          <h2>The result</h2>
          <Figure spec={fig} className="cfig" />
        </section>
      ) : null}

      <section className="bf-how" aria-label="How it works">
        <h2>How it works</h2>
        <Schematic schematic={system.schematic} label={system.name} />
      </section>

      <p className="bf-more">
        <a className="go" href={techPath(system)}>
          Every number, table and caveat: the full technical write-up <span aria-hidden="true">→</span>
        </a>
      </p>

      {ring ? <PrevNext prev={ring.prev} next={ring.next} /> : null}
    </article>
  );
}
