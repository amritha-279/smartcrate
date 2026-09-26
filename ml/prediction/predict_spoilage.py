import os
import joblib
import pandas as pd
import numpy as np

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS_DIR = os.path.join(BASE_DIR, "models")

MODEL_PATH = os.path.join(MODELS_DIR, "spoilage_model.joblib")
PREPROCESSOR_PATH = os.path.join(MODELS_DIR, "spoilage_preprocessor.joblib")
ENCODER_PATH = os.path.join(MODELS_DIR, "spoilage_encoder.joblib")
METADATA_PATH = os.path.join(MODELS_DIR, "spoilage_metadata.joblib")

_model = None
_preprocessor = None
_encoder = None
_metadata = None

def load_spoilage_artifacts():
    global _model, _preprocessor, _encoder, _metadata
    if _model is None:
        if os.path.exists(MODEL_PATH) and os.path.exists(PREPROCESSOR_PATH) and os.path.exists(ENCODER_PATH):
            _model = joblib.load(MODEL_PATH)
            _preprocessor = joblib.load(PREPROCESSOR_PATH)
            _encoder = joblib.load(ENCODER_PATH)
            if os.path.exists(METADATA_PATH):
                _metadata = joblib.load(METADATA_PATH)
        else:
            return False
    return True

def predict_spoilage_risk(input_data: dict) -> dict:
    """
    Predict spoilage risk level (Low/Medium/High) and class probabilities.
    input_data dictionary expected keys:
    - crop (str)
    - maturity_stage (str)
    - hours_since_harvest (float/int)
    - temperature_c (float)
    - humidity_percent (float)
    - ethylene_ppm (float)
    - voc_index (float)
    - co2_ppm (float)
    - weight_loss_percent (float)
    """
    if not load_spoilage_artifacts():
        return {
            "status": "error",
            "message": "Spoilage model artifacts not found. Please train model using ml/training/train_spoilage.py first."
        }

    input_df = pd.DataFrame([input_data])
    
    # Process features using preprocessor
    X_processed = _preprocessor.transform(input_df)
    
    # Predict probabilities and class
    probs = _model.predict_proba(X_processed)[0]
    pred_idx = np.argmax(probs)
    predicted_label = _encoder.classes_[pred_idx]
    
    class_probabilities = {
        cls: round(float(prob), 4)
        for cls, prob in zip(_encoder.classes_, probs)
    }

    return {
        "status": "success",
        "predicted_spoilage_risk": str(predicted_label),
        "confidence": round(float(probs[pred_idx]), 4),
        "probabilities": class_probabilities,
        "model_used": _metadata.get("model_name", "Trained Classifier") if _metadata else "Trained Classifier"
    }
