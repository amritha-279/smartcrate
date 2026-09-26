# SmartCrate Machine Learning Service

A self-contained Machine Learning pipeline, evaluation suite, saved models, feature lookup engines, and FastAPI microservice for **SmartCrate**.

---

## 📁 Directory Structure

```text
SmartCrate/ml/
├── dataset/                              # Read-only original CSV datasets
│   ├── smartcrate_combined_e_nose_dataset.csv
│   ├── spoilage_sensor_starter.csv
│   ├── market_prices.csv
│   └── india_2000_2024_daily_weather.csv
├── preprocessing/                        # Modular data transformation
│   ├── __init__.py
│   ├── sensor_preprocessing.py
│   ├── spoilage_preprocessing.py
│   ├── market_preprocessing.py
│   └── weather_preprocessing.py
├── training/                             # Model training modules
│   ├── __init__.py
│   ├── train_spoilage.py
│   └── train_shelflife_template.py
├── prediction/                           # Inference & lookup modules
│   ├── __init__.py
│   ├── predict_spoilage.py
│   ├── predict_shelflife.py
│   ├── market_lookup.py
│   └── weather_lookup.py
├── evaluation/                           # Model evaluation & metrics
│   ├── __init__.py
│   ├── metrics.py
│   └── evaluate_spoilage.py
├── models/                               # Serialized model artifacts
│   ├── spoilage_model.joblib
│   ├── spoilage_preprocessor.joblib
│   ├── spoilage_encoder.joblib
│   └── spoilage_metadata.joblib
├── notebooks/                            # Analysis scripts & test suite
│   ├── dataset_analysis.py
│   └── test_pipeline_and_api.py
├── app.py                                # FastAPI Microservice
├── requirements.txt                      # Dependencies
└── README.md                             # Documentation
```

---

## 📊 Dataset Analysis & Verification

All four original datasets located in `ml/dataset/` are kept read-only and preserved:

| Dataset | Row Count | Column Count | Actual Columns Found | Purpose |
|---|---|---|---|---|
| `spoilage_sensor_starter.csv` | 5,000 | 10 | `crop`, `maturity_stage`, `hours_since_harvest`, `temperature_c`, `humidity_percent`, `ethylene_ppm`, `voc_index`, `co2_ppm`, `weight_loss_percent`, `spoilage_risk` | Classification of produce spoilage risk (`Low`, `Medium`, `High`). |
| `smartcrate_combined_e_nose_dataset.csv` | 295,000 | 12 | `source_file`, `fruit_label`, `ticks`, `mq2`, `mq3`, `mq4`, `mq5`, `mq6`, `mq7`, `mq8`, `mq9`, `mq135` | Multi-sensor gas readings across produce types (`mq2`-`mq9`, `mq135`). Preprocessed for gas feature extraction. |
| `market_prices.csv` | 5,000 | 10 | `STATE`, `District Name`, `Market Name`, `Commodity`, `Variety`, `Grade`, `Min_Price`, `Max_Price`, `Modal_Price`, `Price Date` | Agricultural commodity price historical lookup engine across markets. |
| `india_2000_2024_daily_weather.csv` | 91,320 | 12 | `city`, `date`, `temperature_2m_max`, `temperature_2m_min`, `apparent_temperature_max`, `apparent_temperature_min`, `precipitation_sum`, `rain_sum`, `weather_code`, `wind_speed_10m_max`, `wind_gusts_10m_max`, `wind_direction_10m_dominant` | Historical weather conditions & climate indicators for Indian cities. |

---

## 🤖 Trained Models vs Un-Trained Templates

| Model | Status | Trained Algorithm | Accuracy / Metrics | Reason |
|---|---|---|---|---|
| **Spoilage Risk Classifier** | ✅ Trained & Active | RandomForestClassifier (vs GradientBoosting) | **Accuracy: 85.60%**, **Weighted F1: 0.8526** | Trained on 5,000 labeled sensor records in `spoilage_sensor_starter.csv`. |
| **Shelf-Life Predictor** | ⏳ Un-Trained Template | N/A | N/A | None of the 4 datasets contain a remaining shelf-life target column (e.g. `remaining_shelf_life_days`). Ready for training once labeled dataset is added. |
| **E-Nose Gas Feature Pipeline** | ⚙️ Preprocessing Built | N/A | N/A | Dataset contains fruit type label (`fruit_label`), not a spoilage target. Preprocessing and scaling module built; no fake classification model trained. |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pip install -r ml/requirements.txt
```

### 2. Run Dataset Analysis
```bash
python ml/notebooks/dataset_analysis.py
```

### 3. Train & Save Spoilage Model
```bash
python ml/training/train_spoilage.py
```

### 4. Run API Test Suite
```bash
python ml/notebooks/test_pipeline_and_api.py
```

### 5. Launch FastAPI Microservice
```bash
uvicorn ml.app:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📡 API Endpoint Reference

### `GET /health`
Returns service status.

### `GET /model/status`
Returns status of all models, algorithms, metric logs, and missing model explanations.

### `POST /predict/spoilage-risk`
Predicts spoilage risk (`Low`, `Medium`, `High`) and class probabilities from sensor input payload.
```json
{
  "crop": "Tomato",
  "maturity_stage": "Ripe",
  "hours_since_harvest": 24.0,
  "temperature_c": 25.5,
  "humidity_percent": 85.0,
  "ethylene_ppm": 4.2,
  "voc_index": 120.0,
  "co2_ppm": 650.0,
  "weight_loss_percent": 2.1
}
```

### `POST /predict/shelf-life`
Returns structured response detailing un-trained model status and missing dataset rationale.

### `POST /market/lookup`
Looks up historical crop market prices, min/max/modal prices, and market locations.

### `POST /weather/lookup`
Looks up historical daily weather averages, precipitation totals, and extreme climate days.
