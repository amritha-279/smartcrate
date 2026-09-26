import os
import pandas as pd
from typing import Optional, List, Dict
from ml.preprocessing.market_preprocessing import load_and_preprocess_market

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MARKET_DATASET_PATH = os.path.join(BASE_DIR, "dataset", "market_prices.csv")

_market_df = None

def get_market_data() -> pd.DataFrame:
    global _market_df
    if _market_df is None:
        if os.path.exists(MARKET_DATASET_PATH):
            _market_df = load_and_preprocess_market(MARKET_DATASET_PATH)
        else:
            _market_df = pd.DataFrame()
    return _market_df

def filter_market_prices(
    crop: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None,
    market: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> pd.DataFrame:
    """
    Filter historical market prices dataframe by crop, location, and date range.
    """
    df = get_market_data().copy()
    if df.empty:
        return df

    if crop:
        df = df[df['Commodity'].str.contains(crop, case=False, na=False)]
    if state:
        df = df[df['State'].str.contains(state, case=False, na=False)]
    if district:
        df = df[df['District'].str.contains(district, case=False, na=False)]
    if market:
        df = df[df['Market'].str.contains(market, case=False, na=False)]
        
    if start_date and 'Arrival_Date' in df.columns:
        df = df[df['Arrival_Date'] >= pd.to_datetime(start_date)]
    if end_date and 'Arrival_Date' in df.columns:
        df = df[df['Arrival_Date'] <= pd.to_datetime(end_date)]

    return df

def get_price_summary(crop: str, district: Optional[str] = None) -> Dict:
    """
    Calculate min, max, average, and modal price summary for a commodity.
    """
    df = filter_market_prices(crop=crop, district=district)
    if df.empty:
        return {
            "crop": crop,
            "record_count": 0,
            "message": f"No market records found for commodity '{crop}'."
        }

    return {
        "crop": crop,
        "district_filter": district,
        "record_count": len(df),
        "avg_modal_price": round(float(df['Modal_Price'].mean()), 2),
        "min_price": round(float(df['Min_Price'].min()), 2),
        "max_price": round(float(df['Max_Price'].max()), 2),
        "markets": df['Market'].unique().tolist(),
        "recent_records": df.sort_values(by='Arrival_Date', ascending=False).head(5).to_dict(orient='records') if 'Arrival_Date' in df.columns else df.head(5).to_dict(orient='records')
    }

def compare_markets(crop: str, markets: List[str]) -> Dict:
    """
    Compare modal prices across multiple markets for a given crop.
    """
    df = get_market_data()
    comparison = {}
    for mkt in markets:
        sub_df = filter_market_prices(crop=crop, market=mkt)
        if not sub_df.empty:
            comparison[mkt] = {
                "record_count": len(sub_df),
                "avg_modal_price": round(float(sub_df['Modal_Price'].mean()), 2),
                "min_price": round(float(sub_df['Min_Price'].min()), 2),
                "max_price": round(float(sub_df['Max_Price'].max()), 2)
            }
        else:
            comparison[mkt] = {"record_count": 0, "message": "No data"}
            
    return {
        "crop": crop,
        "comparison": comparison
    }
