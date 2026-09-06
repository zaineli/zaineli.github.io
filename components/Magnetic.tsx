"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Magnetic hover: the wrapped INNER content eases toward the cursor while the
 * pointer is over the interactive PARENT, then springs back on leave. Only the
 * inner span translates (transform-only), so the hit area / border never moves
 * and there's zero layout shift. Pointer-only — disabled on touch and when
 * prefers-reduced-motion is set, mirroring the custom cursor.
 *
 * Usage: <a className="…button…"><Magnetic>Label</Magnetic></a>
 */
export default function Magnetic({
  children,
  /** fraction of the cursor's offset-from-center to follow */
  strength = 0.3,
  /** max travel in px */
  max = 6,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let rect: DOMRect | null = null;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;

    const clamp = (v: number) => Math.max(-max, Math.min(max, v));

    const tick = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      const settled = Math.abs(tx - cx) < 0.1 && Math.abs(ty - cy) < 0.1;
      if (settled) {
        if (!tx && !ty) {
          el.style.transform = "";
          el.style.willChange = "";
        } else {
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        }
        raf = 0;
        return;
      }
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      rect = parent.getBoundingClientRect();
      el.style.willChange = "transform";
    };
    const onMove = (e: PointerEvent) => {
      if (!rect) rect = parent.getBoundingClientRect();
      tx = clamp((e.clientX - (rect.left + rect.width / 2)) * strength);
      ty = clamp((e.clientY - (rect.top + rect.height / 2)) * strength);
      run();
    };
    const onLeave = () => {
      rect = null;
      tx = 0;
      ty = 0;
      run();
    };

    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength, max]);

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {children}
    </span>
  );
}
