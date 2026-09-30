/**
 * A display number with its unit split off, so "13.4 %", "13.4%" and
 * "2.50×" all set the same way everywhere: the digits at full size, the
 * unit at half size with no space.
 */
export default function Num({ value, unit }: { value: string; unit?: string }) {
  const m = unit ? null : /^(.*?\d)\s?([%×])$/.exec(value);
  const digits = m ? m[1] : value;
  const u = unit ?? (m ? m[2] : undefined);
  return (
    <>
      {digits}
      {u ? <span className="unit">{u}</span> : null}
    </>
  );
}
