import joblib

from app.core.config import settings
from app.schemas.prediction import PredictionRequest
from app.services.preprocessing import request_to_dataframe

_model = None


def load_model():
    """Loads the trained sklearn Pipeline from disk. Call once, at app startup."""
    global _model
    _model = joblib.load(settings.model_path)
    return _model


def get_model():
    if _model is None:
        raise RuntimeError("Model has not been loaded yet. Call load_model() at startup.")
    return _model


def predict_price(payload: PredictionRequest) -> float:
    model = get_model()
    df = request_to_dataframe(payload)
    prediction = model.predict(df)
    return float(prediction[0])
