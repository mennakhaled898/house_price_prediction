import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="shell">
      <aside className="hero">
        <span className="eyebrow">Property valuation</span>
        <h1>
          What's your
          <br />
          place worth?
        </h1>
        <p>
          Trained on ~95,000 Indian listings and a Random Forest model, refined
          from raw broker text to a clean estimate.
        </p>
        <dl className="hero-stats">
          <div className="hero-stat">
            <dt>R²</dt>
            <dd>0.93</dd>
          </div>
          <div className="hero-stat">
            <dt>Median error</dt>
            <dd>≈ ₹9.6L</dd>
          </div>
        </dl>
      </aside>

      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}