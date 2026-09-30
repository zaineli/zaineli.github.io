import { Fragment } from "react";

/**
 * Display type should not break "long-horizon" or "Per-Skill" at its
 * hyphen. The font has no non-breaking hyphen (U+2011), so each hyphenated
 * word is wrapped in a no-wrap span instead; the text itself is unchanged.
 */
export default function KeepHyphens({ text }: { text: string }) {
  const parts = text.split(/(\S*\w-\w\S*)/);
  return (
    <>
      {parts.map((part, i) =>
        /\w-\w/.test(part) ? (
          <span key={i} className="nw">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
