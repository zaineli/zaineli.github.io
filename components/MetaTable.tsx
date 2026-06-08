import type { ReactNode } from "react";

export interface MetaRow {
  label: string;
  value: ReactNode;
}

export default function MetaTable({ rows, className = "" }: { rows: MetaRow[]; className?: string }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-start gap-3 border-t border-border-row px-px pt-[12px] pb-[12px] sm:pt-[15.247px] sm:pb-[16.5px]"
        >
          <span className="t-table-label w-[72px] shrink-0 sm:w-[75.94px]">{r.label}</span>
          <span className="t-table-value flex-1">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
