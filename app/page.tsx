import Hero from "@/components/sections/Hero";
import Systems from "@/components/sections/Systems";
import Papers from "@/components/sections/Papers";
import SaidNo from "@/components/sections/SaidNo";
import Record from "@/components/sections/Record";
import Contact from "@/components/sections/Contact";

/**
 * AGAINST THE CONTROL. A reader from a research lab does not trust a
 * headline number; they look for what it was measured against. Every piece
 * of work here has one — a tuned hybrid, a held-out gate, a uniform-length
 * control, an oracle, static roles — so the page is set the way such a
 * reader already reads: a title, a results table, the papers, the errata,
 * the author's record. Serif for what is read, grotesk for what is
 * measured, one red for what said no.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Systems />
      <Papers />
      <SaidNo />
      <Record />
      <Contact />
    </>
  );
}
