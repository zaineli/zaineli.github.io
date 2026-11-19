import type { Metadata } from "next";

/**
 * A missing page is no copy of the home page: its own title, and no
 * canonical (the layout's would point it at "/"). Next marks it noindex.
 */
export const metadata: Metadata = {
  title: "Not found",
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="wrap lost">
      <h1>Not found</h1>
      <p>This page doesn’t exist.</p>
      <div className="actions">
        <a className="btn btn-primary" href="/">
          Back to the start
        </a>
      </div>
    </section>
  );
}
