"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import ThemeToggle from "./ThemeToggle";

const SECTIONS = [
  { label: "Research", href: "/#research" },
  { label: "Experience", href: "/#experience" },
  { label: "Systems", href: "/#systems" },
  { label: "Publications", href: "/#publications" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section currently owns the upper third of the viewport.
  useEffect(() => {
    const ids = SECTIONS.map((s) => s.href.split("#")[1]);
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-border-subtle bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] backdrop-blur-[10px]"
          : "border-transparent bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between px-5 sm:px-8 md:h-16">
        <Link
          href="/"
          className="font-serif text-[17px] tracking-[-0.01em] text-fg transition-colors hover:text-accent"
        >
          {profile.wordmark}
        </Link>

        <nav className="flex min-w-0 items-center gap-1 sm:gap-2">
          {/* Scrollable on narrow screens rather than hidden: the section links
              are the only navigation this site has, so dropping them on mobile
              leaves no way to reach anything but the top. */}
          <div className="scroll-x flex items-center gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => {
              const id = s.href.split("#")[1];
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={`rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[13px] transition-colors ${
                    active === id ? "text-accent" : "text-fg-subtle hover:text-fg"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
