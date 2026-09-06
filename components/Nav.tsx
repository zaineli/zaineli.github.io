"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile, contactCTA } from "@/lib/content";
import ThemeToggle from "./ThemeToggle";
import Magnetic from "./Magnetic";
import { ArrowUpRight } from "./icons";

const LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Playground", href: "/playground" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`nav-enter sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200 ${
        scrolled
          ? "border-border-subtle bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur-[8px]"
          : "border-transparent bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1441px] items-center justify-between px-5 sm:px-8 md:h-20 lg:px-[52px]">
        {/* Wordmark */}
        <Link
          href="/"
          data-cursor="pointer"
          data-cursor-text="Home"
          className="t-nav-wordmark inline-flex items-baseline gap-1.5 lowercase"
        >
          <span>{profile.wordmark}</span>
          <span className="hidden text-fg-subtle sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="hidden font-normal text-fg-subtle sm:inline">{profile.tagline}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="group/nav hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="pointer"
              className="t-nav-link inline-flex h-7 items-center gap-[6px] rounded-[var(--radius-pill)] border border-transparent px-[10px] text-fg-muted transition-[color,background-color,border-color] duration-[180ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/nav:text-fg-subtle hover:!border-border-default hover:!bg-[var(--pill-bg-active)] hover:!text-fg"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={profile.socials.cv.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            data-cursor-text={profile.socials.cv.cursor}
            className="t-nav-link inline-flex h-7 items-center gap-[4px] rounded-[var(--radius-pill)] border border-transparent px-[10px] text-fg-muted transition-[color,background-color,border-color] duration-[180ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/nav:text-fg-subtle hover:!border-border-default hover:!bg-[var(--pill-bg-active)] hover:!text-fg"
          >
            CV
            <ArrowUpRight className="opacity-60" />
          </a>

          <span className="mx-1 h-4 w-px bg-border-subtle" aria-hidden="true" />

          <a
            href={contactCTA.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            data-cursor-text={contactCTA.cursor}
            className="t-meta inline-flex h-8 items-center rounded-[var(--radius-pill)] border border-border-default px-2.5 text-fg transition-colors duration-150 hover:bg-[var(--pill-bg-active)]"
          >
            <Magnetic>{contactCTA.label}</Magnetic>
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            data-cursor="pointer"
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-pill)] border border-transparent text-fg transition-colors duration-150 hover:border-border-default hover:bg-[var(--pill-bg-active)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-border-subtle bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-[8px] md:hidden">
          <nav className="mx-auto flex max-w-[1441px] flex-col gap-1 px-5 py-4 sm:px-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="t-nav-link rounded-[var(--radius-md)] px-3 py-2.5 text-fg-muted transition-colors hover:bg-[var(--pill-bg-active)] hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={profile.socials.cv.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="t-nav-link inline-flex items-center gap-1 rounded-[var(--radius-md)] px-3 py-2.5 text-fg-muted transition-colors hover:bg-[var(--pill-bg-active)] hover:text-fg"
            >
              CV <ArrowUpRight className="opacity-60" />
            </a>
            <a
              href={contactCTA.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="t-meta mt-1 inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-border-default px-3 py-2.5 text-fg transition-colors hover:bg-[var(--pill-bg-active)]"
            >
              {contactCTA.label}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
