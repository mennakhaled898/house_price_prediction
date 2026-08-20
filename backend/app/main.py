from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.prediction import router as prediction_router
from app.core.config import settings
from app.services.inference import load_model
from app.services.preprocessing import load_known_locations
from app.utils.logging_config import configure_logging

logger = configure_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model and locations once at startup, not on every request.
    logger.info("Loading model from %s", settings.model_path)
    load_model()
    load_known_locations()
    logger.info("Model loaded successfully.")
    yield
    logger.info("Shutting down.")


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)


@app.get("/")
def root():
    return {"message": "House Price Prediction API. See /docs for the interactive API reference."}
