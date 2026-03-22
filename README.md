# 🌍 AQI Prediction & Analysis System – Full Technical Documentation

## 🚀 Overview

This project is an end-to-end **Air Quality Monitoring, Prediction, and Analysis System** that:

* Collects AQI + weather data
* Predicts future AQI using a **Multivariate LSTM model**
* Visualizes AQI spatially on maps
* Performs **source detection**
* Provides **policy recommendations**

---

# 📊 1. Data Collection

## Sources:

* Air Quality API (PM2.5, PM10, NO₂)
* Weather API (Temperature, Humidity, Wind Speed, Rainfall)

## Data Frequency:

* Hourly → converted to daily aggregates

## Features:

```text
aqi, temperature, humidity, wind_speed, rain
```

---

# 🧠 2. AQI Calculation

## Method:

AQI is approximated using **PM2.5 concentration**

### Formula (Simplified Linear Scaling):

```text
AQI ≈ PM2.5 value (normalized)
```

### Improved Approach (Optional):

* Breakpoints (EPA standard)
* Interpolation between ranges

---

# 🗺️ 3. Zone Mapping & Area Division

## 🔹 Grid-Based Spatial Division

The entire region is divided into **geographical grids (zones)**:

### Step-by-step:

1. Define bounding box (lat/lon)
2. Divide into equal grid cells (e.g., 5km × 5km)
3. Each grid = one AQI zone

```text
Region → Grid Partition → Zones
```

---

## 🔹 AQI Calculation for Each Zone

### Method Used:

* **Nearest Neighbor Interpolation**

### Logic:

```text
If zone has station → use direct AQI
Else:
    Find nearest stations
    Weighted average based on distance
```

### Example:

```text
Station A → 50 km → AQI = 200  
Station B → 80 km → AQI = 250  

Zone AQI ≈ 200–250 (weighted)
```

---

## 🔹 Visualization

* Map rendered using GeoJSON

* Color-coded zones:

  * 🟢 Good
  * 🟡 Moderate
  * 🔴 Unhealthy

* Zoom levels:

  * Country → State AQI
  * State → City AQI
  * City → Area AQI

---

# 🔍 4. Source Detection (Advanced Logic)

## ❗ Not just LLM-based — Hybrid Technical Approach

### 🔹 Features Used:

* Wind direction & speed
* Pollution gradients
* Temporal AQI variation
* Industrial/traffic zones

---

## 🔹 Algorithm Used

### 1. Gradient Analysis

```text
AQI difference between nearby zones → detect direction of increase
```

### 2. Wind Vector Correlation

```text
If AQI increases opposite to wind direction → possible source
```

### 3. Temporal Pattern Detection

```text
Morning spike → traffic  
Night spike → industrial activity
```

---

## 🔹 ML-Based Classification

* Input:

  * AQI trends
  * Weather data
  * Time patterns

* Output:

```text
Traffic / Industrial / Dust / Mixed Source
```

---

## 🔹 Heuristic Model

```text
IF wind low AND AQI high → local source  
IF wind high AND AQI spreads → external source  
```

---

# 🤖 5. AQI Prediction Model

## Model Type:

* Multivariate LSTM

## Input:

```text
Past 48 hours → AQI + Weather + Lag features
```

## Output:

```text
Next 12-hour AQI prediction
```

---

## 🔹 Features Used:

* AQI
* Temperature
* Humidity
* Wind Speed
* Rainfall
* Lag features (t-1, t-2)
* AQI change (ΔAQI)

---

## 🔹 Training Pipeline:

```text
Train-Test Split
→ Scaling (MinMax)
→ Sequence Creation
→ LSTM Training
→ Evaluation (MAE, RMSE)
```

---

## 🔹 Key Improvements:

* MAE / Huber Loss
* Dropout Regularization
* Recursive Prediction
* Weather Correction Layer

---

# ⚡ 6. Real-Time Prediction Pipeline

```text
API Data → Preprocessing → LSTM Model
                                ↓
                        Prediction Output
                                ↓
                    Weather Adjustment Layer
                                ↓
                         Final AQI Value
```

---

# 🌧️ Weather Correction Logic

```text
If rainfall ↑ → AQI ↓  
If wind speed ↑ → AQI ↓  
```

---

# 🧾 7. Policy Recommendation System

## 🔹 Multi-Factor Analysis

Inputs:

* AQI level
* Source type
* Weather conditions
* Time patterns

---

## 🔹 Rule-Based + AI Hybrid

### Example Logic:

```text
IF AQI > 200 AND source = traffic:
    Suggest:
        - Odd-even rule
        - Traffic restriction
        - Public transport boost
```

```text
IF AQI > 250 AND source = industrial:
    Suggest:
        - Temporary shutdown
        - Emission control
```

---

## 🔹 Generated Outputs (Policy Maker View)

* Short-term actions
* Long-term strategies
* Risk alerts

---

# 🏗️ 8. Backend Architecture

```text
FastAPI Backend
│
├── Load LSTM Model (.h5)
├── Load Scaler (.pkl)
├── Fetch Real-time Data
├── Prediction Engine
├── Source Detection Module
└── Policy Engine
```

---

# 📁 Required Files

```text
lstm_model.h5
scaler.pkl
aqi_dataset.csv
features.json
```

---

# 📈 9. Evaluation Metrics

* MAE (Mean Absolute Error)
* RMSE (Root Mean Squared Error)

---

# 🔥 10. Key Highlights

✅ Multivariate AQI prediction
✅ Weather-aware modeling
✅ Spatial AQI mapping
✅ Source detection using hybrid logic
✅ Intelligent policy recommendation system

---

# 💡 Conclusion

This system combines:

* Machine Learning (LSTM)
* Spatial Analysis
* Environmental Modeling
* Rule-based Intelligence

to create a **complete AQI monitoring and decision-support platform**.

---

# 🛠️ Installation & Getting Started

## 📥 Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16+. recommended for frontend and backend)
- [Python 3.8+](https://www.python.org/) (for ML service)
- [Git](https://git-scm.com/)

**Clone the repository:**
```bash
git clone <repository_url>
cd AQI-prediction
```

## 🖥️ 1. Frontend

The frontend is built with React/Next.js.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## ⚙️ 2. Backend

The backend is built with Node.js/Express.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🤖 3. ML-Service

The machine learning service (FastAPI/Python) handles AQI prediction and data analysis.

```bash
# Navigate to the ml-service directory
cd ml-service

# Create a virtual environment (recommended)
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI service (using Uvicorn)
uvicorn main:app --reload
```

---
