"use client";

import { useState } from "react";

const MODES = [
  { id: "all", label: "All" },
  { id: "no", label: "Said no" },
  { id: "held", label: "Held" },
] as const;

/**
 * Filters the write-up by what each section reports. It dims rather than
 * removes — a reader who asks for what said no still sees how much of the
 * page held, and nothing reflows. Three plain text buttons; nothing
 * animates.
 */
export default function ResultsMode({ target }: { target: string }) {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("all");

  return (
    <div className="modes" role="group" aria-label="Filter the write-up">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          aria-pressed={mode === m.id}
          onClick={() => {
            setMode(m.id);
            document.getElementById(target)?.setAttribute("data-results", m.id);
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
