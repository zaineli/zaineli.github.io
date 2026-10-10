import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Rules from "@/components/sections/Rules";
import Papers from "@/components/sections/Papers";
import Record from "@/components/sections/Record";
import Contact from "@/components/sections/Contact";

/**
 * THE GUESS. One voice on one sheet: what he thinks machines cannot do and
 * what he is building about it, the rules he works by, the work that keeps
 * them — each piece against the control that could have killed it — the
 * papers, the record.
 * Hairlines, a serif in two optical sizes, a grotesk for what is measured,
 * and one colour, which means one thing: the result said no.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Rules />
      <Work />
      <Papers />
      <Record />
      <Contact />
    </>
  );
}
