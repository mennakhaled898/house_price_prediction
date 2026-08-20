from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)  # triggers the lifespan (loads the model) on first request


VALID_PAYLOAD = {
    "location": "new-delhi",
    "carpet_area_sqft": 1200,
    "floor_num": 3,
    "bathroom": 2,
    "balcony": 2,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
    "ownership": "Freehold",
    "facing": "East",
}


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_happy_path():
    with TestClient(app) as c:
        response = c.post("/predict", json=VALID_PAYLOAD)
        assert response.status_code == 200
        body = response.json()
        assert "predicted_price" in body
        assert isinstance(body["predicted_price"], float)
        assert body["predicted_price"] > 0


def test_predict_invalid_input_returns_422():
    with TestClient(app) as c:
        bad_payload = dict(VALID_PAYLOAD)
        bad_payload["carpet_area_sqft"] = -50  # violates gt=0
        response = c.post("/predict", json=bad_payload)
        assert response.status_code == 422


def test_predict_unknown_location_falls_back_to_other():
    """Unknown locations should not crash - they map to 'Other' via handle_unknown='ignore'."""
    with TestClient(app) as c:
        payload = dict(VALID_PAYLOAD)
        payload["location"] = "some-city-not-in-training-data"
        response = c.post("/predict", json=payload)
        assert response.status_code == 200
