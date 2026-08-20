from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Matches the features the model was trained on in the notebook:

    numeric_features     = ["carpet_area_sqft", "floor_num", "Bathroom", "Balcony"]
    categorical_features = ["location_top", "Furnishing", "Transaction", "Ownership", "facing"]
    """

    location: str = Field(..., description="Property location, e.g. 'new-delhi'. Unknown values are mapped to 'Other'.")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet area in square feet")
    floor_num: int = Field(..., description="Floor number (0 = Ground, -1/-2 = basements)")
    bathroom: int = Field(..., ge=0, description="Number of bathrooms")
    balcony: int = Field(..., ge=0, description="Number of balconies")
    furnishing: str = Field(..., description="'Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'Unknown'")
    transaction: str = Field(..., description="'New Property' | 'Resale' | 'Other' | 'Unknown'")
    ownership: str = Field(..., description="'Freehold' | 'Leasehold' | 'Co-operative Society' | 'Power Of Attorney' | 'Unknown'")
    facing: str = Field(..., description="'East' | 'West' | 'North' | 'South' | 'North - East' | ... | 'Unknown'")

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float
