import numpy as np
import joblib
import json
import requests
import os
import sys
# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from tensorflow.keras.models import load_model

class AQIForecaster:
    def __init__(self, model_path, scaler_path, api_url=None):
        """
        Initializes the forecasting system.
        """
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.api_url = api_url or "https://api.open-meteo.com/v1/air-quality?latitude=28.61&longitude=77.23&hourly=pm10"
        
        self.model = None
        self.scaler = None
        self._load_assets()

    def _load_assets(self):
        """
        Loads the trained LSTM model and the scaler.
        """
        try:
            self.scaler = joblib.load(self.scaler_path)
        except Exception as e:
            print(f"Error loading scaler from {self.scaler_path}: {e}")
            sys.exit(1)
            
        try:
            self.model = load_model(self.model_path)
        except Exception as e:
            print(f"Error loading model from {self.model_path}: {e}")
            sys.exit(1)

    def fetch_recent_data(self):
        """
        Fetches the latest AQI (PM10/PM2.5) data from an external API.
        Returns a list of at least 24 recent AQI values.
        """
        try:
            response = requests.get(self.api_url)
            response.raise_for_status()
            data = response.json()
            
            # Assuming Open-Meteo format for the placeholder API
            # For a real API, extract the specific AQI values differently
            if 'hourly' in data and 'pm10' in data['hourly']:
                aqi_values = data['hourly']['pm10']
                # Get the last 24 available values, ignoring None/null
                valid_aqies = [val for val in aqi_values if val is not None]
                if len(valid_aqies) >= 24:
                    return valid_aqies[-24:]
                else:
                    return self._handle_insufficient_data(valid_aqies)
            else:
                raise ValueError("Unexpected API response format")
                
        except Exception as e:
            print(f"Error fetching data from API: {e}. Using fallback data.")
            # Fallback data if API fails
            fallback = [float(x) for x in range(100, 124)]
            return fallback
            
    def _handle_insufficient_data(self, available_data):
        """
        Handles cases where API returns fewer than 24 data points.
        Pads with the last known value or a default value.
        """
        needed = 24 - len(available_data)
        if len(available_data) > 0:
            pad_value = available_data[0]
        else:
            pad_value = 100.0 # Default fallback
            
        padded_data = [pad_value] * needed + available_data
        return padded_data

    def predict_next_6_hours(self):
        """
        Generates a 6-hour forecast based on the last 24 hours of data.
        """
        # 1. Fetch data
        recent_data = self.fetch_recent_data()
        
        # 2. Extract and ensure we have exactly 24 values
        if len(recent_data) > 24:
            recent_data = recent_data[-24:]
        
        # 3. Scale data
        # Reshape for scaler (samples, features) -> (24, 1)
        data_array = np.array(recent_data).reshape(-1, 1)
        scaled_data = self.scaler.transform(data_array)
        
        # 4. Prepare Input for LSTM
        # Reshape to (batch_size, time_steps, features) -> (1, 24, 1)
        current_sequence = scaled_data.reshape(1, 24, 1)
        
        predictions = []
        
        # 5. Generate 6-Hour Forecast iteratively
        for _ in range(6):
            # Predict one step ahead
            next_pred_scaled = self.model.predict(current_sequence, verbose=0)
            
            # Record the prediction
            predictions.append(next_pred_scaled[0, 0])
            
            # Append predicted value to sequence, remove oldest
            # next_pred_scaled is shape (1, 1), we need to reshape to (1, 1, 1) to append along axis 1
            next_pred_reshaped = next_pred_scaled.reshape(1, 1, 1)
            
            # current_sequence[:, 1:, :] gets the last 23 elements, we append the new one
            current_sequence = np.append(current_sequence[:, 1:, :], next_pred_reshaped, axis=1)
            
        # 6. Inverse Scaling
        # predictions is a list of 6 values. Reshape to (6, 1)
        pred_array = np.array(predictions).reshape(-1, 1)
        final_predictions = self.scaler.inverse_transform(pred_array)
        
        return [int(round(val[0])) for val in final_predictions]
        
    def display_forecast(self, predictions):
        """
        Formats and prints the forecast.
        """
        print("Next 6 Hour AQI Forecast:")
        for i, val in enumerate(predictions, 1):
            print(f"Hour {i}: {val}")


if __name__ == "__main__":
    # Correct paths based on the directory structure where app.py resides
    # Assuming script runs from the ml-service directory
    model_file = "best_lstm_model.keras"
    scaler_file = "scale(1).joblib"
    
    forecaster = AQIForecaster(model_path=model_file, scaler_path=scaler_file)
    
    forecasts = forecaster.predict_next_6_hours()
    forecaster.display_forecast(forecasts)
