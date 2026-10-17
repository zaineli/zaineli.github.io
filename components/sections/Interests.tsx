import { home, interests } from "@/lib/content";

/** What he works on, each with the position he holds on it: a claim and the reason it follows. */
export default function Interests() {
  return (
    <section id="interests" className="panel" aria-labelledby="h-interests">
      <div className="wrap sec">
        <h2 className="eyebrow" id="h-interests">
          Interests
        </h2>
        <p className="int-lede">{home.interestsLine}</p>
        <ol className="ints">
          {interests.map((it) => (
            <li key={it.name}>
              <h3>{it.name}</h3>
              <p>{it.take}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
