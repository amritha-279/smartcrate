import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib

NUMERICAL_COLS = [
    'hours_since_harvest',
    'temperature_c',
    'humidity_percent',
    'ethylene_ppm',
    'voc_index',
    'co2_ppm',
    'weight_loss_percent'
]

CATEGORICAL_COLS = ['crop', 'maturity_stage']
TARGET_COL = 'spoilage_risk'

def build_spoilage_pipeline():
    """
    Build a sklearn ColumnTransformer pipeline for spoilage sensor data.
    """
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', num_pipeline, NUMERICAL_COLS),
        ('cat', cat_pipeline, CATEGORICAL_COLS)
    ])

    return preprocessor

def load_and_preprocess_spoilage(filepath: str):
    """
    Loads spoilage dataset, fits preprocessing pipeline and encodes target label.
    """
    df = pd.read_csv(filepath)

    if TARGET_COL not in df.columns:
        raise ValueError(f"Target column '{TARGET_COL}' not found in {filepath}")

    X = df[NUMERICAL_COLS + CATEGORICAL_COLS].copy()
    y_raw = df[TARGET_COL].copy()

    # Fit Label Encoder for Target ('Low', 'Medium', 'High')
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(y_raw)

    preprocessor = build_spoilage_pipeline()
    X_processed = preprocessor.fit_transform(X)

    # Get feature names after one-hot encoding
    cat_feature_names = preprocessor.named_transformers_['cat'].named_steps['onehot'].get_feature_names_out(CATEGORICAL_COLS)
    feature_names = NUMERICAL_COLS + list(cat_feature_names)

    X_processed_df = pd.DataFrame(X_processed, columns=feature_names)

    return X_processed_df, y, preprocessor, label_encoder
