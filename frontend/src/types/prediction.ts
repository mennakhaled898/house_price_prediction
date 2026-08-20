export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  furnishing: "Furnished" | "Semi-Furnished" | "Unfurnished" | "Unknown";
  transaction: "New Property" | "Resale" | "Other" | "Unknown";
  ownership:
    | "Freehold"
    | "Leasehold"
    | "Co-operative Society"
    | "Power Of Attorney"
    | "Unknown";
  facing:
    | "East"
    | "West"
    | "North"
    | "South"
    | "North - East"
    | "North - West"
    | "South - East"
    | "South -West"
    | "Unknown";
}

export interface PredictionResponse {
  predicted_price: number;
}
