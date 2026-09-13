import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Interests from "@/components/Interests";
import Experience from "@/components/Experience";
import Systems from "@/components/Systems";
import Publications from "@/components/Publications";

export default function Home() {
  return (
    <>
      <Hero />

      <Section
        id="research"
        eyebrow="Research interests"
        intro="Four threads, all pointed at the same problem: an agent that does not get better with use is a demo, not a system."
      >
        <Interests />
      </Section>

      <Section id="experience" eyebrow="Experience">
        <Experience />
      </Section>

      <Section
        id="systems"
        eyebrow="Systems"
        intro="Built from scratch, benchmarked against the baselines they claim to beat, and written up with the negative results included. Every number links to the script that produced it."
      >
        <Systems />
      </Section>

      <Section id="publications" eyebrow="Publications">
        <Publications />
      </Section>
    </>
  );
}
