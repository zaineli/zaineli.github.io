import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { publications, shownLedger, systems, type Publication, type SystemSection } from "@/lib/content";
import { slugify } from "@/lib/slug";
import CaseSection from "@/components/case/CaseSection";
import CopyBib from "@/components/case/CopyBib";
import PrevNext from "@/components/case/PrevNext";
import Schematic from "@/components/Schematic";
import KeepHyphens from "@/components/KeepHyphens";

/**
 * Static params come from `publications`, and nothing else builds this
 * route. With PMR_PUBLIC false in lib/content.ts, `publications` holds only
 * CONOID, so no page for the dark paper exists in the export — not
 * unlinked, not built, not in the sitemap.
 */
export function generateStaticParams() {
  return publications.map((p) => ({ slug: p.slug }));
}

const findPaper = (slug: string): Publication | undefined => publications.find((p) => p.slug === slug);

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const paper = findPaper(slug);
  if (!paper) return {};
  const title = paper.title;
  const description = paper.abstract.split(". ")[0] + ".";
  const url = `/papers/${paper.slug}/`;
  const up = await parent;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", images: up.openGraph?.images },
    twitter: { card: "summary_large_image", title, description, images: up.twitter?.images },
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The write-up: the preprint's own abstract, its figures with the paper's own notes beside them, and how to cite it. */
export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = findPaper(slug);
  if (!paper) notFound();

  const i = publications.findIndex((p) => p.slug === paper.slug);
  const chain = [
    ...systems.map((s) => ({ href: `/systems/${s.slug}/`, name: s.name })),
    ...publications.map((p) => ({ href: `/papers/${p.slug}/`, name: p.shortTitle })),
  ];
  const index = systems.length + i;
  const prev = chain[(index - 1 + chain.length) % chain.length];
  const next = chain[(index + 1) % chain.length];
  const ledger = shownLedger(paper.ledger ?? []);

  // The paper's figures, each as its own section with the paper's verbatim
  // note in the margin; then any written sections.
  const figureSections = paper.figures.map((f) => ({
    section: { heading: cap(f.label), negative: f.negative } as SystemSection,
    figures: [f],
    notes: paper.notes?.[f.id] ? [paper.notes[f.id]] : [],
  }));

  return (
    <article id="case" data-results="all">
      <div className="chero g12">
        <h1 className="cname">{paper.shortTitle}</h1>
        <p className="ctag">
          <KeepHyphens text={paper.title} />
        </p>
      </div>

      <div className="plate g12">
        <div className="q1">
          <p className="k">{[paper.year, "Paper"].filter(Boolean).join(" · ")}</p>
          <p className="meta">{paper.status}</p>
          {(paper.authorList ?? []).map((a) => (
            <p key={a.name} className="meta">
              {a.name}
              <span>{a.affiliation}</span>
            </p>
          ))}
        </div>
        <div className="q2">
          <p className="num">{paper.readout.value}</p>
          <p className="cap">{paper.readout.label}</p>
        </div>
        <div className="q3">
          <p className="k">Read</p>
          <p className="go">
            {paper.media.pdf ? (
              <a className="u" href={paper.media.pdf} target="_blank" rel="noreferrer noopener">
                PDF
              </a>
            ) : null}
            {paper.bibtex ? <CopyBib text={paper.bibtex} /> : null}
          </p>
        </div>
        <div className="q4">
          {paper.media.page1 && paper.media.pdf ? (
            <a className="page" href={paper.media.pdf} target="_blank" rel="noreferrer noopener" aria-label={`${paper.shortTitle} preprint, PDF`}>
              <img
                src={paper.media.page1.replace(".webp", "-360.webp")}
                srcSet={`${paper.media.page1.replace(".webp", "-360.webp")} 360w, ${paper.media.page1.replace(".webp", "-660.webp")} 660w`}
                sizes="180px"
                width={824}
                height={1067}
                alt={`First page of the ${paper.shortTitle} preprint`}
              />
            </a>
          ) : null}
        </div>
      </div>

      <Schematic schematic={paper.schematic} label={paper.shortTitle} />

      {/* The preprint's abstract, verbatim: long, so it is set as prose,
          not at lede size. */}
      <section className="cs g12" id="abstract">
        <h2>Abstract</h2>
        <div className="body">
          <p>{paper.abstract}</p>
        </div>
      </section>

      {figureSections.map((fs) => (
        <CaseSection
          key={fs.section.heading}
          section={fs.section}
          own={paper.shortTitle}
          figures={fs.figures}
          notes={fs.notes}
        />
      ))}

      {(paper.sections ?? []).map((s) => {
        const id = slugify(s.heading);
        return (
          <CaseSection
            key={s.heading}
            section={s}
            own={paper.shortTitle}
            figures={[]}
            ledger={ledger.filter((e) => e.anchor === id)}
          />
        );
      })}

      {paper.bibtex ? (
        <section className="cs g12" id="cite">
          <h2>Cite</h2>
          <div className="body">
            <pre className="bib">{paper.bibtex}</pre>
          </div>
        </section>
      ) : null}

      <PrevNext prev={prev} next={next} />
    </article>
  );
}
