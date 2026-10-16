import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Papers from "@/components/sections/Papers";
import Record from "@/components/sections/Record";
import Rules from "@/components/sections/Rules";
import Contact from "@/components/sections/Contact";

/**
 * Round 25, the ceramic: white, every section in its own frame. The first
 * frame holds one glossy white knot; beside the work, a close view of the
 * same knot becomes each project's own knot as you point at its row.
 */
export default function Home() {
  return (
    <div className="home">
      <Hero />
      <div className="panel show">
        <div className="wrap show-in">
          <div className="show-text">
            <Projects />
            <Papers />
          </div>
          <div className="show-side">
            <div className="stage" data-stage="work" aria-hidden="true">
              <canvas />
            </div>
          </div>
        </div>
      </div>
      <Rules />
      <Record />
      <Contact />
    </div>
  );
}
