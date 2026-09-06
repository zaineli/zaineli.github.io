"use client";

import { useEffect, useRef } from "react";

/**
 * A 2px accent read-indicator pinned just under the sticky nav. Tracks scroll
 * 1:1 via a rAF-throttled passive listener (no CSS transition — a transition
 * here would lag the scrollbar and read as cheap). The scrollable height is
 * cached and only recomputed on resize / content-size change, never per scroll.
 * Decorative (aria-hidden); the native scrollbar is the real affordance.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let max = 1;
    let raf = 0;

    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-40 h-[2px] origin-left bg-[var(--accent)] md:top-20"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
