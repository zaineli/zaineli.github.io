import { negativeCount, profile } from "@/lib/content";

/** What he believes, in two sentences, and three working rules — the second one links to everything that didn't work. */
export default function Rules() {
  const [test, fails, less] = profile.principles;
  return (
    <section id="how" className="wrap sec" aria-labelledby="h-how">
      <div className="grid">
        <h2 className="sec-title" id="h-how">
          How I work
        </h2>
        <div className="sec-body">
          <p className="belief">
            <span>{profile.belief.doubt}</span> <b>{profile.belief.bet}</b>
          </p>
          <ul className="principles">
            <li>{test}</li>
            <li>
              {fails}
              <a className="more" href="/said-no/">
                See all {negativeCount} →
              </a>
            </li>
            <li>{less}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
