import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {}

export async function predictPrice(
  payload: PredictionRequest
): Promise<PredictionResponse> {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new ApiError(
      `Prediction request failed (${response.status}): ${detail}`
    );
  }

  return response.json() as Promise<PredictionResponse>;
}

export async function fetchLocations(): Promise<string[]> {
  // locations.json is bundled statically in /public, so no network round trip
  // to the backend is required just to populate the dropdown.
  const response = await fetch("/locations.json");
  if (!response.ok) {
    throw new ApiError("Could not load the list of locations.");
  }
  return response.json() as Promise<string[]>;
}
