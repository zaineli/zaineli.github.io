/**
 * Structured data for search engines: schema.org JSON-LD, read by them and
 * never seen by a reader. Marked data-keep so strip-js leaves it on the
 * static pages (it is data, not framework JavaScript), and "<" is escaped so
 * no value can close the tag. It says only what the page itself shows.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      data-keep=""
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
