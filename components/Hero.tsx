import { profile } from "@/lib/content";
import { Asterisk } from "./icons";
import Avatar from "./Avatar";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="relative w-full px-5 sm:px-8 lg:px-[80px]">
      <Asterisk className="pointer-events-none absolute right-2 top-0 hidden h-auto w-[200px] text-fg opacity-[0.08] sm:block md:w-[260px] lg:w-[320px] dark:opacity-[0.15]" />
      <div className="mx-auto max-w-[1280px]">
        <Reveal y={12}>
          <div className="flex items-center gap-4 sm:gap-5">
            <Avatar
              src={profile.photo}
              alt={profile.name}
              initials="ZA"
              className="h-[60px] w-[60px] shrink-0 rounded-full border border-border-default shadow-[var(--shadow-card)] sm:h-[72px] sm:w-[72px]"
            />
            <div>
              <h1 className="t-hero-name">{profile.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="t-hero-role">
                  {profile.role} @ {profile.company}
                </span>
                <span className="hidden h-4 w-px bg-border-subtle sm:inline-block" aria-hidden="true" />
                <span className="t-hero-role font-normal text-fg-muted">{profile.location}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal y={12} delay={80} className="mt-6">
          <p className="t-hero-body max-w-[640px] text-fg-muted">{profile.heroBio}</p>
        </Reveal>

        <Reveal y={12} delay={160} className="mt-6">
          <p className="t-mono-xs text-fg-subtle">{profile.focus.join("  ·  ")}</p>
        </Reveal>
      </div>
    </section>
  );
}
