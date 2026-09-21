/** Inline monoline icons for the hero link row. 18px, currentColor, no deps. */

type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function MailIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6.5 8.2 6a1.4 1.4 0 0 0 1.6 0l8.2-6" />
    </svg>
  );
}

export function GitHubIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.1.7-.22.7-.49v-1.9c-2.84.62-3.44-1.2-3.44-1.2-.47-1.18-1.14-1.5-1.14-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.06 1.57 1.06.91 1.57 2.4 1.11 2.98.85.09-.66.36-1.11.65-1.37-2.27-.26-4.66-1.14-4.66-5.06 0-1.12.4-2.03 1.05-2.75-.1-.26-.45-1.3.1-2.71 0 0 .86-.28 2.81 1.05a9.7 9.7 0 0 1 5.12 0c1.95-1.33 2.8-1.05 2.8-1.05.56 1.41.21 2.45.1 2.71.66.72 1.05 1.63 1.05 2.75 0 3.93-2.39 4.8-4.67 5.05.37.32.69.94.69 1.9v2.8c0 .28.19.6.7.5A10.2 10.2 0 0 0 12 1.8Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.83v1.54h.05a4.2 4.2 0 0 1 3.78-2.08c4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.46c0-1.3-.02-2.98-1.81-2.98-1.82 0-2.1 1.42-2.1 2.88V21h-4V9.75Z" />
    </svg>
  );
}

export function ScholarIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 22 9l-10 5.5L2 9l10-5.5Z" />
      <path d="M6 11.2V16c0 1.9 2.7 3.4 6 3.4s6-1.5 6-3.4v-4.8" />
    </svg>
  );
}
