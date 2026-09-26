import os
import pandas as pd
from typing import Optional, Dict
from ml.preprocessing.weather_preprocessing import load_and_preprocess_weather

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
WEATHER_DATASET_PATH = os.path.join(BASE_DIR, "dataset", "india_2000_2024_daily_weather.csv")

_weather_df = None

def get_weather_data() -> pd.DataFrame:
    global _weather_df
    if _weather_df is None:
        if os.path.exists(WEATHER_DATASET_PATH):
            _weather_df = load_and_preprocess_weather(WEATHER_DATASET_PATH)
        else:
            _weather_df = pd.DataFrame()
    return _weather_df

def get_weather_summary(city: str, year: Optional[int] = None, month: Optional[int] = None) -> Dict:
    """
    Get aggregated weather statistics for a city.
    """
    df = get_weather_data()
    if df.empty:
        return {"city": city, "status": "error", "message": "Weather dataset not loaded."}

    sub_df = df[df['city'].str.contains(city, case=False, na=False)]
    if year:
        sub_df = sub_df[sub_df['year'] == year]
    if month:
        sub_df = sub_df[sub_df['month'] == month]

    if sub_df.empty:
        return {
            "city": city,
            "record_count": 0,
            "message": f"No weather records found for city '{city}' with year={year}, month={month}."
        }

    summary = {
        "city": city,
        "record_count": len(sub_df),
        "date_range": [str(sub_df['date'].min().date()), str(sub_df['date'].max().date())] if 'date' in sub_df.columns else [],
        "avg_temp_max": round(float(sub_df['temperature_2m_max'].mean()), 2),
        "avg_temp_min": round(float(sub_df['temperature_2m_min'].mean()), 2),
        "total_rain_sum": round(float(sub_df['rain_sum'].sum()), 2),
        "extreme_heat_days": int(sub_df['is_extreme_heat'].sum()) if 'is_extreme_heat' in sub_df.columns else 0,
        "heavy_rain_days": int(sub_df['is_heavy_rain'].sum()) if 'is_heavy_rain' in sub_df.columns else 0
    }

    return summary
