from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import random

app = Flask(__name__)
CORS(app)

@app.route('/ml/predict-source', methods=['POST'])
def predict_source():
    """
    Predicts the primary source of pollution based on pollutant ratios.
    Expects JSON: { "pm25": float, "pm10": float, "no2": float, "so2": float, "co": float }
    """
    data = request.get_json()
    pm25 = data.get('pm25', 0)
    pm10 = data.get('pm10', 0)
    no2 = data.get('no2', 0)
    
    # Simple heuristic-based logic as a placeholder for a trained model
    ratio = pm25 / pm10 if pm10 > 0 else 0
    
    if ratio > 0.7:
        source = "Biomass Burning / Residential Heating"
    elif ratio > 0.5:
        source = "Vehicular Emissions / Traffic"
    elif no2 > 50:
        source = "Industrial Emissions / Power Plants"
    elif pm10 > 150:
        source = "Construction Dust / Road Dust"
    else:
        source = "Mixed Urban Background"
        
    return jsonify({
        "source": source,
        "confidence": round(random.uniform(0.7, 0.95), 2),
        "ratios": {
            "pm25_pm10": round(ratio, 2)
        }
    })

@app.route('/ml/predict-aqi', methods=['POST'])
def predict_aqi():
    """
    Predicts future AQI (6-hour forecast).
    Expects JSON: { "current_aqi": int, "historical_data": list }
    """
    data = request.get_json()
    current_aqi = data.get('current_aqi', 100)
    
    # Mocking a Time-Series prediction (e.g., LSTM/RNN output)
    predictions = []
    base_aqi = current_aqi
    
    for i in range(1, 7):
        # Add some variance for the forecast
        change = random.uniform(-10, 20)
        base_aqi += change
        predictions.append({
            "hour": i,
            "predicted_aqi": int(max(0, base_aqi)),
            "confidence": round(random.uniform(0.6, 0.85) - (i * 0.05), 2)
        })
        
    return jsonify({
        "ward": data.get('ward', 'Unknown'),
        "forecast": predictions,
        "model_version": "v1.0.4-hybrid"
    })

if __name__ == '__main__':
    app.run(port=5002, debug=True)
