import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Papers from "@/components/sections/Papers";
import Record from "@/components/sections/Record";
import Rules from "@/components/sections/Rules";
import Contact from "@/components/sections/Contact";

/**
 * Round 19, the direction he picked: a clean, white, modern page in plain
 * words. Who he is and what he builds, the projects with one result each,
 * the paper, where he has worked and studied, how he works, how to reach
 * him. One family (Geist), soft grey cards, one orange dot.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Papers />
      <Record />
      <Rules />
      <Contact />
    </>
  );
}
