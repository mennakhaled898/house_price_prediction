import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="page notfound">
      <span className="eyebrow">Not found</span>
      <h1>404</h1>
      <p style={{ color: "var(--ink-soft)", margin: "0.75rem 0 1.5rem" }}>
        This page doesn't exist.
      </p>
      <Link to="/">← Back home</Link>
    </main>
  );
}