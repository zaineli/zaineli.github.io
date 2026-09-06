"use client";

import { useState } from "react";
import { Asterisk } from "./icons";

interface AvatarProps {
  src: string;
  alt: string;
  /** sizing + shape utilities (e.g. "h-16 w-16 rounded-full") */
  className?: string;
  /** grayscale at rest, color on hover — fits the monochrome editorial look */
  desaturate?: boolean;
  initials?: string;
}

/**
 * Renders the portrait, with a graceful monogram fallback if the image is
 * missing (so the layout looks intentional until public/profile.png is added).
 */
export default function Avatar({ src, alt, className = "", desaturate = false, initials = "ZA" }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-bg-muted ${className}`}>
      {failed ? (
        <div className="relative flex h-full w-full items-center justify-center">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(120% 120% at 25% 20%, var(--accent) 0%, transparent 55%)",
              opacity: 0.18,
            }}
          />
          <Asterisk className="absolute -right-3 -top-3 h-16 w-16 text-fg opacity-[0.06]" />
          <span className="t-eyebrow text-fg-subtle">{initials}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover object-center transition duration-500 ease-out ${
            desaturate ? "grayscale hover:grayscale-0" : ""
          }`}
        />
      )}
    </div>
  );
}
