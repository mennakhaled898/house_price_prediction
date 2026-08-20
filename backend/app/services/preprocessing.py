import json
from pathlib import Path

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest

# Column order/names must exactly match what the notebook trained on:
#   numeric_features     = ["carpet_area_sqft", "floor_num", "Bathroom", "Balcony"]
#   categorical_features = ["location_top", "Furnishing", "Transaction", "Ownership", "facing"]
NUMERIC_FEATURES = ["carpet_area_sqft", "floor_num", "Bathroom", "Balcony"]
CATEGORICAL_FEATURES = ["location_top", "Furnishing", "Transaction", "Ownership", "facing"]
ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES

_known_locations: set[str] | None = None


def load_known_locations() -> list[str]:
    """Loads the list of locations seen during training (from locations.json)."""
    global _known_locations
    path = Path(settings.locations_path)
    if not path.exists():
        _known_locations = set()
        return []
    with open(path) as f:
        locations = json.load(f)
    _known_locations = set(locations)
    return locations


def request_to_dataframe(payload: PredictionRequest) -> pd.DataFrame:
    """Builds a single-row DataFrame with exactly the column names used in training.

    Because the exported model is a full sklearn Pipeline (imputing, scaling,
    one-hot encoding all bundled in), no manual encoding is needed here -
    the pipeline does it. We only need to get the column names/values right.
    """
    if _known_locations is None:
        load_known_locations()

    location_top = payload.location if payload.location in (_known_locations or set()) else "Other"

    row = {
        "carpet_area_sqft": payload.carpet_area_sqft,
        "floor_num": payload.floor_num,
        "Bathroom": payload.bathroom,
        "Balcony": payload.balcony,
        "location_top": location_top,
        "Furnishing": payload.furnishing,
        "Transaction": payload.transaction,
        "Ownership": payload.ownership,
        "facing": payload.facing,
    }

    return pd.DataFrame([row], columns=ALL_FEATURES)
