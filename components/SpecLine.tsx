import { Fragment } from "react";

/**
 * A "·"-separated list of test conditions that breaks only between items:
 * each item is kept whole, and the dot stays with the item before it.
 */
export default function SpecLine({ text }: { text: string }) {
  const items = text.split(" · ");
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={`${item}-${i}`}>
          <span className="nw">
            {item}
            {i < items.length - 1 ? " ·" : ""}
          </span>
          {i < items.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}
