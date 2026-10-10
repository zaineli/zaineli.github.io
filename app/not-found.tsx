export default function NotFound() {
  return (
    <section className="wrap lost">
      <h1>Page not found</h1>
      <p>This page doesn’t exist.</p>
      <div className="actions">
        <a className="btn btn-primary" href="/">
          Back to home
        </a>
      </div>
    </section>
  );
}
