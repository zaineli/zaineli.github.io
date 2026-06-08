import { profile } from "@/lib/content";

const FOOTER_LINKS = [
  profile.socials.github,
  profile.socials.linkedin,
  profile.socials.cv,
  profile.socials.email,
];

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="mx-auto flex w-full max-w-[1441px] flex-col items-start gap-6 border-t border-border-subtle px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between md:px-[80px] md:py-[64px] lg:px-[104.5px]">
        <p className="t-footer-body">
          Designed &amp; developed with <span aria-label="love">❤️</span> by @{profile.wordmark}
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 md:gap-x-[32px]">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              data-cursor="pointer"
              data-cursor-text={l.cursor}
              className="t-footer-link link-underline"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
