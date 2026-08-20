import PredictionForm from "../components/PredictionForm";

export default function HomePage() {
  return (
    <main className="page">
      <span className="eyebrow">Enter details</span>
      <h1>Get an estimate</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
        Nine fields, one prediction. Fields left blank or invalid are called
        out before you submit.
      </p>
      <div className="card">
        <PredictionForm />
      </div>
    </main>
  );
}