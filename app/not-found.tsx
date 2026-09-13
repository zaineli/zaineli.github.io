import Link from "next/link";

export default function NotFound() {
  return (
    <section className="w-full px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto w-full max-w-[1100px]">
        <p className="t-eyebrow">404</p>
        <h1 className="t-section mt-5">This page wandered off.</h1>
        <p className="t-body mt-4 max-w-[46ch]">
          The link you followed doesn&apos;t exist — or doesn&apos;t exist yet.
        </p>
        <Link href="/" className="link mt-6 inline-block text-[14px]">
          ← Back home
        </Link>
      </div>
    </section>
  );
}
