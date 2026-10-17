import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { shownLedger, systemBySlug, systems } from "@/lib/content";
import LongWriteup from "@/components/case/LongWriteup";
import Arrow from "@/components/ui/Arrow";

/** Only a system whose page is a brief has a technical page; the others print the write-up on their own page. */
export function generateStaticParams() {
  return systems.filter((s) => s.brief).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const s = systemBySlug(slug);
  if (!s?.brief) return {};
  const title = `${s.name}, the technical write-up`;
  const url = `/systems/${s.slug}/technical/`;
  const up = await parent;
  return {
    title,
    description: s.pitch,
    keywords: s.metaKeywords,
    alternates: { canonical: url },
    openGraph: { title, description: s.pitch, url, type: "article", images: up.openGraph?.images },
    twitter: { card: "summary_large_image", title, description: s.pitch, images: up.twitter?.images },
  };
}

export default async function TechnicalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const system = systemBySlug(slug);
  if (!system?.brief) notFound();
  const ledger = shownLedger(system.ledger);
  const open = system.repoPublic !== false;
  return (
    <article className="wrap case" id="case">
      <p className="crumb">
        <a href={`/systems/${system.slug}/`}>← {system.name}, in brief</a>
      </p>
      <header className="page-head">
        <h1>{system.name}</h1>
        <p className="page-lede">{system.tagline}. The full write-up: every number, table and caveat.</p>
        <div className="actions">
          {open ? (
            <a className="btn btn-primary" href={system.repo} target="_blank" rel="noreferrer noopener">
              Code on GitHub <Arrow />
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
      <LongWriteup system={system} />
      <p className="bf-more">
        <a className="go" href={`/systems/${system.slug}/`}>
          <span aria-hidden="true">←</span> Back to {system.name}, in brief
        </a>
      </p>
    </article>
  );
}
