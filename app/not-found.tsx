import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="w-full px-5 sm:px-8 lg:px-[80px]">
      <div className="mx-auto max-w-[1280px]">
        <p className="t-mono-xs text-fg-subtle">404</p>
        <h1 className="t-display-lg mt-3">This page wandered off.</h1>
        <p className="t-body mt-4 max-w-[480px] text-fg-muted">
          The link you followed doesn&apos;t exist — or not yet.
        </p>
        <Link
          href="/"
          data-cursor="pointer"
          className="group/cta t-link mt-6 inline-flex items-center gap-1.5 text-[var(--accent)] transition-opacity hover:opacity-70"
        >
          Back home
          <ArrowRight className="transition-transform duration-200 group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
