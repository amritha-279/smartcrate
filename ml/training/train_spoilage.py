import os
import joblib
import pandas as pd

# Fix import paths when running standalone script
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from ml.evaluation.evaluate_spoilage import compare_spoilage_models

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "spoilage_sensor_starter.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")

def run_spoilage_training():
    """
    Runs model training, selects best model based on weighted F1 score,
    and saves trained artifacts into ml/models/.
    """
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    print(f"Loading spoilage dataset from: {DATASET_PATH}")
    results, preprocessor, label_encoder = compare_spoilage_models(DATASET_PATH)

    best_model_name = None
    best_f1 = -1.0
    best_model_data = None

    print("\n--- Model Evaluation Results ---")
    for name, data in results.items():
        m = data["metrics"]
        print(f"\nModel: {name}")
        print(f"  Accuracy:           {m['accuracy']}")
        print(f"  Precision (Macro):   {m['precision_macro']}")
        print(f"  Recall (Macro):      {m['recall_macro']}")
        print(f"  F1-Score (Macro):    {m['f1_macro']}")
        print(f"  F1-Score (Weighted): {m['f1_weighted']}")
        print(f"  Confusion Matrix:    {m['confusion_matrix']}")

        if m['f1_weighted'] > best_f1:
            best_f1 = m['f1_weighted']
            best_model_name = name
            best_model_data = data

    print(f"\nSelected Best Model: {best_model_name} (Weighted F1: {best_f1})")

    # Save artifacts
    model_filepath = os.path.join(MODELS_DIR, "spoilage_model.joblib")
    preprocessor_filepath = os.path.join(MODELS_DIR, "spoilage_preprocessor.joblib")
    encoder_filepath = os.path.join(MODELS_DIR, "spoilage_encoder.joblib")
    metadata_filepath = os.path.join(MODELS_DIR, "spoilage_metadata.joblib")

    joblib.dump(best_model_data["model_instance"], model_filepath)
    joblib.dump(preprocessor, preprocessor_filepath)
    joblib.dump(label_encoder, encoder_filepath)

    meta_info = {
        "model_name": best_model_name,
        "metrics": best_model_data["metrics"],
        "target_classes": list(label_encoder.classes_),
        "status": "trained"
    }
    joblib.dump(meta_info, metadata_filepath)

    print(f"Saved best model to: {model_filepath}")
    print(f"Saved preprocessor to: {preprocessor_filepath}")
    print(f"Saved label encoder to: {encoder_filepath}")

    return meta_info

if __name__ == "__main__":
    run_spoilage_training()
