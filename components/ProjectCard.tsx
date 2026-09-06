import Link from "next/link";
import type { ProjectCard as P } from "@/lib/content";
import MetaTable from "./MetaTable";
import ProjectVisual from "./ProjectVisual";
import ProjectMedia from "./ProjectMedia";
import { ArrowUpRight, ArrowRight } from "./icons";

export default function ProjectCard({ project, index }: { project: P; index: number }) {
  const reverse = index % 2 === 1;
  const external = !project.internal;

  const linkRow = external ? (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="pointer"
      className="inline-flex items-center gap-1 text-[var(--accent)] transition-opacity hover:opacity-70"
    >
      {project.linkLabel}
      <ArrowUpRight />
    </a>
  ) : (
    <Link
      href={project.href}
      data-cursor="pointer"
      className="group/cta inline-flex items-center gap-1 text-[var(--accent)] transition-opacity hover:opacity-70"
    >
      {project.linkLabel}
      <ArrowRight className="transition-transform duration-200 group-hover/cta:translate-x-1" />
    </Link>
  );

  const rows = [
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
    { label: "Scope", value: project.scope.join(", ") },
    { label: "Device", value: project.device },
    { label: "Tools", value: project.tools.join(", ") },
    { label: "Link", value: linkRow },
  ];

  const visual = (
    <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover/img:scale-[1.03]">
      {project.media ? (
        <ProjectMedia media={project.media} sizes="(min-width: 768px) 62vw, 100vw" />
      ) : (
        <ProjectVisual name={project.name} hueFrom={project.hueFrom} hueTo={project.hueTo} />
      )}
    </div>
  );

  const imageCardClass =
    "group/img relative block aspect-[839/597] w-full overflow-hidden rounded-[16px] border border-border-default";
  const cursorText = external ? "Visit" : "View case study";

  return (
    <article
      className={`flex flex-col gap-8 md:items-center md:gap-[44px] ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Text column — proportional (≈397:839 ratio) so it never overflows below 1280px */}
      <div className="flex flex-col md:w-[34%] md:shrink-0 md:pr-[18px]">
        <h3 className="t-project-name">{project.name}</h3>
        <div className="mt-2 flex flex-col gap-2">
          {project.body.map((p, i) => (
            <p key={i} className="t-project-body text-fg-muted">
              {p}
            </p>
          ))}
        </div>
        <MetaTable rows={rows} className="pt-[16px]" />
      </div>

      {/* Image card */}
      {external ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-text={`${cursorText} — ${project.name}`}
          className={`${imageCardClass} md:flex-1`}
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {visual}
        </a>
      ) : (
        <Link
          href={project.href}
          data-cursor-text={`${cursorText} — ${project.name}`}
          className={`${imageCardClass} md:flex-1`}
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {visual}
        </Link>
      )}
    </article>
  );
}
