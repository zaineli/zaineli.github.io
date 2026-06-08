import { experience } from "@/lib/content";

export default function ExperienceTimeline() {
  return (
    <div className="flex flex-col">
      {experience.map((row) => (
        <div
          key={`${row.year}-${row.company}`}
          className="grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-x-3 gap-y-[2px] py-[10px] sm:grid-cols-[104px_224px_minmax(0,1fr)] sm:gap-x-[8px]"
        >
          <span className="t-exp-year">{row.year}</span>
          <span className="t-exp-company truncate">{row.company}</span>
          <span className="t-exp-role col-start-2 row-start-2 truncate sm:col-start-3 sm:row-start-1">
            {row.role}
          </span>
        </div>
      ))}
    </div>
  );
}
