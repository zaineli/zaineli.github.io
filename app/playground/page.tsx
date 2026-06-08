import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "@/components/icons";
import { playground } from "@/lib/content";

export const metadata: Metadata = {
  title: "Playground",
  description: "Side projects, experiments, and research spikes.",
};

export default function PlaygroundPage() {
  return (
    <section className="w-full px-5 sm:px-8 lg:px-[80px]">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <p className="t-eyebrow text-fg-subtle">Playground</p>
          <h1 className="t-display-lg mt-3 max-w-[760px]">Built at 3 a.m., mostly on purpose</h1>
          <p className="t-body mt-4 max-w-[640px] text-fg-muted">
            Systems, agents, and tools I built to see if I could — distributed infra, computer vision, and a bit
            of chaos. Most are open source.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col">
          {playground.map((item, i) => (
            <Reveal key={item.name}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                data-cursor-text="Open"
                className="group/row flex flex-col gap-2 border-t border-border-row py-6 transition-colors sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="t-mono-xs w-[72px] shrink-0 text-fg-subtle">{item.tag}</span>
                <span className="flex-1">
                  <span className="t-subhead inline-flex items-center gap-1.5 text-fg transition-colors group-hover/row:text-[var(--accent)]">
                    {item.name}
                    <ArrowUpRight className="opacity-50 transition-transform duration-200 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5" />
                  </span>
                  <span className="t-project-body mt-2 block max-w-[640px] text-fg-muted">{item.blurb}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
