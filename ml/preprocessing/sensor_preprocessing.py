import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Actual MQ sensor columns in smartcrate_combined_e_nose_dataset.csv
MQ_SENSOR_COLS = ['mq2', 'mq3', 'mq4', 'mq5', 'mq6', 'mq7', 'mq8', 'mq9', 'mq135']

def load_and_preprocess_enose(filepath: str):
    """
    Load and preprocess the E-Nose dataset.
    Extract sensor features and compute statistical gas ratios.
    Does NOT fabricate a freshness/spoilage label since the dataset only contains fruit_label.
    """
    df = pd.read_csv(filepath)
    
    # Ensure sensor columns exist
    available_sensors = [col for col in MQ_SENSOR_COLS if col in df.columns]
    
    # Basic Feature Engineering for Gas Sensors
    features_df = df[available_sensors].copy()
    
    # Gas ratios / aggregations
    features_df['mq_sum'] = features_df[available_sensors].sum(axis=1)
    features_df['mq_mean'] = features_df[available_sensors].mean(axis=1)
    features_df['mq_std'] = features_df[available_sensors].std(axis=1)
    features_df['mq2_mq135_ratio'] = features_df['mq2'] / (features_df['mq135'] + 1e-6)
    
    # Scale features
    scaler = StandardScaler()
    scaled_array = scaler.fit_transform(features_df)
    scaled_df = pd.DataFrame(scaled_array, columns=features_df.columns)
    
    metadata = {
        "fruit_label": df['fruit_label'] if 'fruit_label' in df.columns else None,
        "source_file": df['source_file'] if 'source_file' in df.columns else None,
        "ticks": df['ticks'] if 'ticks' in df.columns else None
    }
    
    return scaled_df, metadata, scaler
