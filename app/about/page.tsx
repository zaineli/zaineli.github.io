import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/Avatar";
import { Asterisk } from "@/components/icons";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Researcher and builder working where rigorous maths and distributed systems meet agentic AI.",
};

const CURRENTLY = [
  "Building Chatly Make at Vyro.ai",
  "Building Conoid, the Internet of Evolving Agents",
  "Finishing my B.Sc. in Computer Science at NUST",
  "Reading the papers behind the systems, then shipping the thing",
];

export default function AboutPage() {
  return (
    <section className="relative w-full px-5 sm:px-8 lg:px-[80px]">
      <Asterisk className="pointer-events-none absolute right-2 top-0 hidden h-auto w-[200px] text-fg opacity-[0.08] sm:block md:w-[260px] lg:w-[320px] dark:opacity-[0.15]" />
      <div className="mx-auto max-w-[1280px]">
        <Reveal y={12}>
          <p className="t-eyebrow text-fg-subtle">About</p>
          <h1 className="t-display-lg mt-3 max-w-[760px]">Stateless AI is broken. I&apos;m fixing it.</h1>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-start md:gap-[64px]">
          {/* Portrait */}
          <Reveal className="md:order-2 md:w-[300px] md:shrink-0" delay={80}>
            <Avatar
              src={profile.photo}
              alt={profile.name}
              desaturate
              className="aspect-[4/5] w-full max-w-[300px] rounded-[var(--radius-lg)] border border-border-default shadow-[var(--shadow-card)]"
            />
            <p className="t-mono-xs mt-3 text-fg-subtle">{profile.location}</p>
          </Reveal>

          {/* Prose */}
          <Reveal className="md:order-1 max-w-[680px] flex-1" y={12} delay={40}>
            <div className="flex flex-col gap-5">
              <p className="t-body text-fg-muted">
                I build <span className="text-fg">AI swarms</span>: multi-agent systems and architectures that
                perceive, decide, and ship on their own. My work starts where a paper ends and a running system
                begins. I like getting there fast.
              </p>
              <p className="t-body text-fg-muted">
                I read the papers, then build the thing. I&apos;ve turned an Alan Turing memory paper into working
                intuition, broken down DeepSeek V3&apos;s internals, and put a Stanford/Berkeley/Princeton result
                into practice: that <em>more</em> LLM calls can make things <em>worse</em>. Then I ship. A reverse
                proxy from scratch. A distributed crawler on AWS. A real-time pipeline on Kafka and Spark. Agents
                that play a 3D game on nothing but a vision model and a plan.
              </p>
              <p className="t-body text-fg-muted">
                Right now: <span className="text-fg">Chatly Make</span> at Vyro.ai, and{" "}
                <span className="text-fg">Conoid</span>, the Internet of Evolving Agents, where agents accumulate
                reputation, memory, and trust across tasks. Before that: agentic systems at Victreat, and
                facial-recognition research at MachVIS, where I helped build <span className="text-fg">TVFace</span>,
                a 2.6M-image dataset published in Springer&apos;s Pattern Analysis and Applications.
              </p>
              <p className="t-body text-fg-muted">
                Maths when it matters. Distributed systems when it has to scale. A bias toward making things
                real, fast.
              </p>
            </div>

            <div className="mt-12">
              <p className="t-eyebrow text-fg-subtle">Currently</p>
              <ul className="mt-4 flex flex-col">
                {CURRENTLY.map((line, i) => (
                  <li key={i} className="flex items-baseline gap-4 border-t border-border-row py-3">
                    <span className="t-mono-xs text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-body text-fg-muted">{renderInline(line)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="t-body mt-12 text-fg-muted">
              Working on something cool? Say hi via{" "}
              <a
                href={profile.socials.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="text-[var(--accent)] link-underline"
              >
                LinkedIn
              </a>{" "}
              ·{" "}
              <a
                href={profile.socials.email.href}
                data-cursor="pointer"
                className="text-[var(--accent)] link-underline"
              >
                email
              </a>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return parts.map((part, i) =>
    part.startsWith("[[") && part.endsWith("]]") ? (
      <mark key={i} className="rounded bg-[var(--tag-bg)] px-1 text-fg-subtle [font-style:italic]">
        {part.slice(2, -2)}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
