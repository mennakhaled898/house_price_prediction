import { Link, useLocation, Navigate } from "react-router-dom";

function formatIndianPrice(rupees: number): string {
  if (rupees >= 1e7) return `₹${(rupees / 1e7).toFixed(2)} Cr`;
  if (rupees >= 1e5) return `₹${(rupees / 1e5).toFixed(2)} Lac`;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export default function ResultPage() {
  const location = useLocation();
  const predictedPrice = (location.state as { predictedPrice?: number } | null)
    ?.predictedPrice;

  if (predictedPrice === undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page">
      <span className="eyebrow">Result</span>
      <h1>Your estimate</h1>
      <div className="result-wrap" style={{ marginTop: "1.5rem" }}>
        <div className="stamp">
          <span className="stamp-label">Model confidence R² 0.93</span>
          <p className="predicted-price">{formatIndianPrice(predictedPrice)}</p>
          <p className="predicted-price-raw">
            ₹{Math.round(predictedPrice).toLocaleString("en-IN")}
          </p>
        </div>
        <Link to="/">← Predict another property</Link>
      </div>
    </main>
  );
}