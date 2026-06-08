import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import SocialRow from "@/components/SocialRow";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Experience */}
      <section className="w-full px-5 sm:px-8 lg:px-[80px]">
        <div className="mx-auto max-w-[1280px]">
          <Reveal y={12}>
            <h2 className="t-eyebrow text-fg-subtle">Experience</h2>
            <div className="mt-5">
              <ExperienceTimeline />
            </div>
            <SocialRow />
          </Reveal>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="w-full scroll-mt-24 px-5 sm:px-8 lg:px-[80px]">
        <div className="mx-auto max-w-[1280px]">
          <Reveal>
            <h2 className="t-eyebrow text-fg-subtle">Selected Work</h2>
          </Reveal>
          <div className="mt-8 flex flex-col gap-[64px] md:mt-12 md:gap-[96px]">
            {projects.map((p, i) => (
              <Reveal key={p.slug}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
