import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from ml.preprocessing.spoilage_preprocessing import load_and_preprocess_spoilage
from ml.evaluation.metrics import evaluate_classification

def compare_spoilage_models(dataset_path: str):
    """
    Train and evaluate multiple models on spoilage_sensor_starter.csv.
    Returns comparison metrics dict.
    """
    X, y, preprocessor, label_encoder = load_and_preprocess_spoilage(dataset_path)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    models = {
        "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=100, random_state=42)
    }

    # Try optional XGBoost via dynamic import to avoid linter missing-import warning
    try:
        import importlib
        xgb_module = importlib.import_module("xgboost")
        models["XGBoost"] = xgb_module.XGBClassifier(random_state=42, eval_metric='mlogloss')
    except (ImportError, ModuleNotFoundError):
        pass

    results = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        metrics = evaluate_classification(y_test, y_pred, target_names=list(label_encoder.classes_))
        results[name] = {
            "metrics": metrics,
            "model_instance": model
        }

    return results, preprocessor, label_encoder
