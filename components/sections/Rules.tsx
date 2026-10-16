import { profile } from "@/lib/content";

/** What he believes, as large as the opening line. */
export default function Rules() {
  return (
    <section className="panel belief" aria-label="What I believe">
      <div className="wrap">
        <p>
          <span className="dim">{profile.belief.doubt}</span> {profile.belief.bet}
        </p>
      </div>
    </section>
  );
}
