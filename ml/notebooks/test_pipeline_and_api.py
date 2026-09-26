import os
import sys
import json
from fastapi.testclient import TestClient

# Add workspace path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from ml.app import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("TESTING FASTAPI ML ENDPOINTS")
    print("=" * 60)

    # 1. Health Endpoint
    res = client.get("/health")
    print("\n1. GET /health")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {res.json()}")
    assert res.status_code == 200

    # 2. Model Status Endpoint
    res = client.get("/model/status")
    print("\n2. GET /model/status")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    assert res.status_code == 200

    # 3. Spoilage Prediction Endpoint
    spoilage_payload = {
        "crop": "Tomato",
        "maturity_stage": "Ripe",
        "hours_since_harvest": 36.0,
        "temperature_c": 28.5,
        "humidity_percent": 82.0,
        "ethylene_ppm": 5.1,
        "voc_index": 140.0,
        "co2_ppm": 720.0,
        "weight_loss_percent": 3.5
    }
    res = client.post("/predict/spoilage-risk", json=spoilage_payload)
    print("\n3. POST /predict/spoilage-risk")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    assert res.status_code == 200

    # 4. Shelf-Life Prediction Endpoint
    shelflife_payload = {
        "crop": "Tomato",
        "temperature_c": 25.0,
        "humidity_percent": 80.0
    }
    res = client.post("/predict/shelf-life", json=shelflife_payload)
    print("\n4. POST /predict/shelf-life")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    assert res.status_code == 200

    # 5. Market Lookup Endpoint
    market_payload = {
        "crop": "Onion",
        "district": "nashik"
    }
    res = client.post("/market/lookup", json=market_payload)
    print("\n5. POST /market/lookup")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    assert res.status_code == 200

    # 6. Weather Lookup Endpoint
    weather_payload = {
        "city": "Delhi",
        "year": 2023,
        "month": 6
    }
    res = client.post("/weather/lookup", json=weather_payload)
    print("\n6. POST /weather/lookup")
    print(f"Status Code: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    assert res.status_code == 200

    print("\n" + "=" * 60)
    print("ALL API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
