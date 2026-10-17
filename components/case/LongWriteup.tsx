import { SPEC_DECODE_HOLD, shownLedger, shownReadouts, shownSections, type System } from "@/lib/content";
import { slugify } from "@/lib/slug";
import { smart } from "@/lib/typo";
import CaseSection from "@/components/case/CaseSection";
import Schematic from "@/components/Schematic";
import Num from "@/components/Num";
import SpecLine from "@/components/SpecLine";

/**
 * A system's full technical write-up: the abstract with its readouts, the
 * mechanism, and every section with its figures, tables and the ledger
 * entries recorded beside them. The archived systems print it on their
 * own page; a selected system prints it on /technical/, behind its brief.
 */
export default function LongWriteup({ system }: { system: System }) {
  const held = SPEC_DECODE_HOLD ? system.held : undefined;
  const figures = [...system.figures, ...system.caseFigures];
  const ledger = shownLedger(system.ledger);
  const sections = shownSections(system);
  return (
    <>
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
    </>
  );
}
