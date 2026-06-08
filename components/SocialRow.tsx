import { profile } from "@/lib/content";
import { SocialIcon } from "./icons";

const ICONS = [
  { ...profile.socials.github, icon: "github" },
  { ...profile.socials.linkedin, icon: "linkedin" },
  { ...profile.socials.cv, icon: "cv" },
  { ...profile.socials.email, icon: "email" },
];

export default function SocialRow() {
  return (
    <div className="relative h-[64px]">
      <div className="absolute inset-x-0 top-0 border-t border-border-subtle" aria-hidden="true" />
      <div className="absolute left-0 top-[16px] flex h-[32px] items-center gap-[16px] sm:left-[12px]">
        {ICONS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={s.label}
            data-cursor="pointer"
            data-cursor-text={s.cursor}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-[var(--radius-sm)] text-fg-muted transition-colors duration-150 hover:bg-[var(--tag-bg)] hover:text-fg"
          >
            <SocialIcon name={s.icon} />
          </a>
        ))}
      </div>
    </div>
  );
}
