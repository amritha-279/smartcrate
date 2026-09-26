import pandas as pd
import numpy as np

def load_and_preprocess_market(filepath: str) -> pd.DataFrame:
    """
    Clean and preprocess market prices dataset.
    Standardizes column names and parses dates and prices.
    """
    df = pd.read_csv(filepath)
    
    # Rename columns to standard clean names
    column_mapping = {
        'STATE': 'State',
        'District Name': 'District',
        'Market Name': 'Market',
        'Commodity': 'Commodity',
        'Variety': 'Variety',
        'Grade': 'Grade',
        'Min_Price': 'Min_Price',
        'Max_Price': 'Max_Price',
        'Modal_Price': 'Modal_Price',
        'Price Date': 'Arrival_Date'
    }
    
    df = df.rename(columns=column_mapping)
    
    # Text standardization (lowercase strip)
    string_cols = ['State', 'District', 'Market', 'Commodity', 'Variety', 'Grade']
    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            
    # Numerical prices
    price_cols = ['Min_Price', 'Max_Price', 'Modal_Price']
    for col in price_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
    # Parse Date
    if 'Arrival_Date' in df.columns:
        df['Arrival_Date'] = pd.to_datetime(df['Arrival_Date'], errors='coerce')
        
    # Drop records with invalid modal price or missing commodity
    df = df.dropna(subset=['Commodity', 'Modal_Price'])
    
    return df
