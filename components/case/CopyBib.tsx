"use client";

import { useState } from "react";

/** Copies the BibTeX entry. The label says "Copied" for two seconds; nothing else changes. */
export default function CopyBib({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="textbtn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* no clipboard: the entry is printed under Cite */
        }
      }}
    >
      {done ? "Copied" : "Copy BibTeX"}
    </button>
  );
}
