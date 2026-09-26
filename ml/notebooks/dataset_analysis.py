import os
import pandas as pd
import json

DATASET_DIR = os.path.join(os.path.dirname(__file__), "..", "dataset")

DATASETS = {
    "e_nose": "smartcrate_combined_e_nose_dataset.csv",
    "spoilage": "spoilage_sensor_starter.csv",
    "market": "market_prices.csv",
    "weather": "india_2000_2024_daily_weather.csv"
}

def analyze_datasets():
    results = {}
    print("=" * 70)
    print("SMARTCRATE DATASET ANALYSIS REPORT")
    print("=" * 70)

    for key, filename in DATASETS.items():
        filepath = os.path.join(DATASET_DIR, filename)
        if not os.path.exists(filepath):
            print(f"File not found: {filename}")
            continue

        df = pd.read_csv(filepath)
        missing = df.isnull().sum().to_dict()
        missing_filtered = {k: v for k, v in missing.items() if v > 0}
        
        info = {
            "filename": filename,
            "row_count": len(df),
            "col_count": len(df.columns),
            "columns": list(df.columns),
            "duplicate_rows": int(df.duplicated().sum()),
            "missing_values_count": len(missing_filtered),
            "missing_values_details": missing_filtered,
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()}
        }
        
        results[key] = info

        print(f"\n--- DATASET: {filename} ---")
        print(f"Row Count: {info['row_count']:,}")
        print(f"Column Count: {info['col_count']}")
        print(f"Columns: {info['columns']}")
        print(f"Duplicate Rows: {info['duplicate_rows']}")
        print(f"Missing Values: {info['missing_values_details'] if info['missing_values_details'] else 'None'}")
        print("Data Types:")
        for col, dt in info['data_types'].items():
            print(f"  - {col}: {dt}")

    print("\n" + "=" * 70)
    return results

if __name__ == "__main__":
    analyze_datasets()
