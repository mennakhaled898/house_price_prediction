from fastapi import APIRouter

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.inference import predict_price
from app.services.preprocessing import load_known_locations

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/locations")
def locations():
    """Convenience endpoint so the frontend can also fetch the location list from the API
    instead of only from the bundled locations.json (handy if it's not deployed statically)."""
    return {"locations": load_known_locations()}


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    price = predict_price(payload)
    return PredictionResponse(predicted_price=price)
