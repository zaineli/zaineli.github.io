"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** stagger delay in ms */
  delay?: number;
  /** travel distance in px (spec tiers: 12 for text rows, 16 for sections) */
  y?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Wraps a block so it ships hidden (opacity 0 + translateY) and animates to
 * rest the first time it scrolls into view. Honors prefers-reduced-motion via CSS.
 */
export default function Reveal({ children, delay = 0, y, className = "", as }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const style: Record<string, string> = {};
  if (delay) style.transitionDelay = `${delay}ms`;
  if (y !== undefined) style["--reveal-y"] = `${y}px`;
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible ? "true" : "false"}
      style={Object.keys(style).length ? (style as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
