import pandas as pd
import numpy as np

def load_and_preprocess_weather(filepath: str) -> pd.DataFrame:
    """
    Clean and preprocess Indian city daily weather dataset.
    Extracts date features and heat/rain indicators.
    """
    df = pd.read_csv(filepath)
    
    # Standardize string fields
    if 'city' in df.columns:
        df['city'] = df['city'].astype(str).str.strip()
        
    # Date parsing
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df['year'] = df['date'].dt.year
        df['month'] = df['date'].dt.month
        df['day'] = df['date'].dt.day
        
    # Temperature range calculation
    if 'temperature_2m_max' in df.columns and 'temperature_2m_min' in df.columns:
        df['temp_range'] = df['temperature_2m_max'] - df['temperature_2m_min']
        
    # Extreme weather indicators
    if 'temperature_2m_max' in df.columns:
        df['is_extreme_heat'] = (df['temperature_2m_max'] > 40.0).astype(int)
    if 'rain_sum' in df.columns:
        df['is_heavy_rain'] = (df['rain_sum'] > 30.0).astype(int)
        
    return df
