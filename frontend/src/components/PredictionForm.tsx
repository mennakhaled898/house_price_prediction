import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLocations, predictPrice, ApiError } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

const FURNISHING_OPTIONS = ["Semi-Furnished", "Unfurnished", "Furnished", "Unknown"];
const TRANSACTION_OPTIONS = ["Resale", "New Property", "Other", "Unknown"];
const OWNERSHIP_OPTIONS = [
  "Freehold",
  "Leasehold",
  "Co-operative Society",
  "Power Of Attorney",
  "Unknown",
];
const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North - East",
  "North - West",
  "South - East",
  "South -West",
  "Unknown",
];

const initialForm: PredictionRequest = {
  location: "",
  carpet_area_sqft: 0,
  floor_num: 0,
  bathroom: 1,
  balcony: 0,
  furnishing: "Unfurnished",
  transaction: "Resale",
  ownership: "Freehold",
  facing: "Unknown",
};

export default function PredictionForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [form, setForm] = useState<PredictionRequest>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch(() => setLocations([]));
  }, []);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.location) next.location = "Select a location.";
    if (!form.carpet_area_sqft || form.carpet_area_sqft <= 0)
      next.carpet_area_sqft = "Must be greater than 0.";
    if (form.bathroom < 0) next.bathroom = "Can't be negative.";
    if (form.balcony < 0) next.balcony = "Can't be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await predictPrice(form);
      navigate("/result", { state: { predictedPrice: result.predicted_price } });
    } catch (err) {
      setApiError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the prediction service. Is the backend running on port 8000?"
      );
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="prediction-form" noValidate>
      <div className="field">
        <label htmlFor="location">Location</label>
        <select
          id="location"
          className={errors.location ? "invalid" : ""}
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        >
          <option value="">Select a location…</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {errors.location && <p className="error">{errors.location}</p>}
      </div>

      <div className="form-grid two-col">
        <div className="field">
          <label htmlFor="carpet_area_sqft">Carpet area (sqft)</label>
          <input
            id="carpet_area_sqft"
            type="number"
            min={0}
            className={errors.carpet_area_sqft ? "invalid" : ""}
            value={form.carpet_area_sqft || ""}
            onChange={(e) => update("carpet_area_sqft", Number(e.target.value))}
          />
          {errors.carpet_area_sqft && <p className="error">{errors.carpet_area_sqft}</p>}
        </div>

        <div className="field">
          <label htmlFor="floor_num">Floor number</label>
          <input
            id="floor_num"
            type="number"
            value={form.floor_num}
            onChange={(e) => update("floor_num", Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="bathroom">Bathrooms</label>
          <input
            id="bathroom"
            type="number"
            min={0}
            className={errors.bathroom ? "invalid" : ""}
            value={form.bathroom}
            onChange={(e) => update("bathroom", Number(e.target.value))}
          />
          {errors.bathroom && <p className="error">{errors.bathroom}</p>}
        </div>

        <div className="field">
          <label htmlFor="balcony">Balconies</label>
          <input
            id="balcony"
            type="number"
            min={0}
            className={errors.balcony ? "invalid" : ""}
            value={form.balcony}
            onChange={(e) => update("balcony", Number(e.target.value))}
          />
          {errors.balcony && <p className="error">{errors.balcony}</p>}
        </div>
      </div>

      <hr className="divider" />

      <div className="form-grid two-col">
        <div className="field">
          <label htmlFor="furnishing">Furnishing</label>
          <select
            id="furnishing"
            value={form.furnishing}
            onChange={(e) => update("furnishing", e.target.value as PredictionRequest["furnishing"])}
          >
            {FURNISHING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="transaction">Transaction</label>
          <select
            id="transaction"
            value={form.transaction}
            onChange={(e) => update("transaction", e.target.value as PredictionRequest["transaction"])}
          >
            {TRANSACTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="ownership">Ownership</label>
          <select
            id="ownership"
            value={form.ownership}
            onChange={(e) => update("ownership", e.target.value as PredictionRequest["ownership"])}
          >
            {OWNERSHIP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="facing">Facing</label>
          <select
            id="facing"
            value={form.facing}
            onChange={(e) => update("facing", e.target.value as PredictionRequest["facing"])}
          >
            {FACING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {apiError && <p className="error api-error">{apiError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Predicting…" : "Predict price"}
      </button>
    </form>
  );
}