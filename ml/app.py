import os
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict

import sys
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from ml.prediction.predict_spoilage import predict_spoilage_risk
from ml.prediction.predict_shelflife import predict_shelf_life
from ml.prediction.market_lookup import get_price_summary, filter_market_prices, compare_markets
from ml.prediction.weather_lookup import get_weather_summary

app = FastAPI(
    title="SmartCrate Machine Learning API",
    description="Microservice providing Spoilage Risk prediction, Market Price analysis, and Weather features.",
    version="1.0.0"
)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Input Schemas
class SpoilageInput(BaseModel):
    crop: str = Field(..., example="Tomato")
    maturity_stage: str = Field(..., example="Ripe")
    hours_since_harvest: float = Field(..., example=24.0)
    temperature_c: float = Field(..., example=25.5)
    humidity_percent: float = Field(..., example=85.0)
    ethylene_ppm: float = Field(..., example=4.2)
    voc_index: float = Field(..., example=120.0)
    co2_ppm: float = Field(..., example=650.0)
    weight_loss_percent: float = Field(..., example=2.1)

class ShelfLifeInput(BaseModel):
    crop: str = Field(..., example="Tomato")
    temperature_c: float = Field(..., example=25.0)
    humidity_percent: float = Field(..., example=80.0)

class MarketQuery(BaseModel):
    crop: str = Field(..., example="Onion")
    district: Optional[str] = Field(None, example="Nashik")
    state: Optional[str] = Field(None, example="Maharashtra")

class WeatherQuery(BaseModel):
    city: str = Field(..., example="Delhi")
    year: Optional[int] = Field(None, example=2023)
    month: Optional[int] = Field(None, example=6)

# Endpoints

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SmartCrate ML Microservice",
        "version": "1.0.0"
    }

@app.get("/model/status")
def model_status():
    spoilage_model_path = os.path.join(MODELS_DIR, "spoilage_model.joblib")
    spoilage_meta_path = os.path.join(MODELS_DIR, "spoilage_metadata.joblib")
    
    spoilage_exists = os.path.exists(spoilage_model_path)
    spoilage_meta = joblib.load(spoilage_meta_path) if os.path.exists(spoilage_meta_path) else {}

    return {
        "spoilage_model": {
            "exists": spoilage_exists,
            "trained": spoilage_exists,
            "model_file": "spoilage_model.joblib" if spoilage_exists else None,
            "algorithm": spoilage_meta.get("model_name", "RandomForest/GradientBoosting"),
            "metrics": spoilage_meta.get("metrics", None)
        },
        "shelf_life_model": {
            "exists": False,
            "trained": False,
            "model_file": None,
            "reason": "Shelf-life model is not trained because a labelled remaining-shelf-life dataset is not available."
        },
        "e_nose_sensor_pipeline": {
            "exists": True,
            "trained": False,
            "reason": "Preprocessing/feature pipeline built. No spoilage target available in e-nose dataset."
        }
    }

@app.post("/predict/spoilage-risk")
def predict_spoilage(payload: SpoilageInput):
    result = predict_spoilage_risk(payload.dict())
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result

@app.post("/predict/shelf-life")
def predict_shelflife_endpoint(payload: ShelfLifeInput):
    return predict_shelf_life(payload.dict())

@app.post("/market/lookup")
def market_lookup(payload: MarketQuery):
    return get_price_summary(crop=payload.crop, district=payload.district)

@app.post("/weather/lookup")
def weather_lookup(payload: WeatherQuery):
    return get_weather_summary(city=payload.city, year=payload.year, month=payload.month)
