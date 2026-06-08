"use client";

import { useEffect, useRef } from "react";

/**
 * Custom inverting cursor follower (amanhsn-style).
 * - Opt-in: sets html[data-cursor-active] only after mount, only on fine pointers
 *   with motion allowed, so touch / reduced-motion / no-JS keep the native cursor.
 * - Reads data-cursor / data-cursor-text off the nearest matching ancestor and
 *   morphs between a dot, an enlarged "pointer" dot, and a labelled pill.
 */
export default function CursorFollow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (coarse.matches || reduce.matches) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !dot || !label) return;

    const html = document.documentElement;
    html.setAttribute("data-cursor-active", "true");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let ready = false;
    let raf = 0;

    const tick = () => {
      x += (mx - x) * 0.2;
      y += (my - y) * 0.2;
      root.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      ready = true;

      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor],[data-cursor-text],[data-cursor-native]"
      );

      // Native zones (e.g. a doodle canvas) hand back to the CSS crosshair —
      // hide the custom dot so the two don't render at once.
      const native = !!el && (el.hasAttribute("data-cursor-native") || el.getAttribute("data-cursor") === "native");
      if (native) {
        root.removeAttribute("data-ready");
        return;
      }
      root.setAttribute("data-ready", "true");

      const text = el?.getAttribute("data-cursor-text");
      if (text) {
        dot.setAttribute("data-mode", "text");
        if (label.textContent !== text) label.textContent = text;
      } else if (el) {
        dot.setAttribute("data-mode", "pointer");
        label.textContent = "";
      } else {
        dot.setAttribute("data-mode", "default");
        label.textContent = "";
      }
    };

    const onLeave = () => root.removeAttribute("data-ready");
    const onEnter = () => {
      if (ready) root.setAttribute("data-ready", "true");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      html.removeAttribute("data-cursor-active");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor-root" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" data-mode="default">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
