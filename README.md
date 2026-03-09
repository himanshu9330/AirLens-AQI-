# AirLens AQI Intelligence

![Platform Overview](https://via.placeholder.com/1200x600/020617/6366f1?text=AirLens+AQI+Intelligence)

**AirLens AQI Intelligence** is a premium, AI-driven environmental data platform designed to monitor, predict, and alert users about air quality at the micro-environment (neighborhood and street) level. 

Unlike traditional platforms that provide a single, inaccurate city-wide average, AirLens processes millions of data points to generate high-resolution spatial mapping of pollution zones.

---

## 🎯 What Has Been Built So Far?

The current state of the repository features a fully functional, highly polished **Frontend Application** built with a premium SaaS and AI-startup aesthetic (inspired by Stripe, Vercel, and Linear).

### 1. The Premium Landing Page (`/`)
A visually stunning, conversion-optimized landing page designed with extensive `framer-motion` animations, glassmorphism, and deep-space dark mode aesthetics.

*   **Hero Section**: Dynamic floating data nodes and slow-pulsing background auroras setting the tone of "Live AI Pollution Intelligence."
*   **The Problem Visualization**: Animated side-by-side comparison illustrating why standard City AQI (a single number) is flawed compared to a AirLens interactive map.
*   **Intelligence Data Flow**: A 6-stage continuously animated pipeline demonstrating how IoT/Satellite data moves through Spatial Processing and ML Inference to reach the Live Dashboard.
*   **Interactive Features**: Glass cards detailing the core utilities (AI Source Detection, Predictive Forecasting, Health Advisories) that glow and lift on hover.
*   **Map Simulation**: A massive "fake UI" mockup of the dashboard rendered entirely in code, featuring infinitely expanding heat zones and pop-in sensor markers.
*   **Tech Showcase**: Explicitly highlights the data engineering stack (TensorFlow, WebSockets, PostGIS).
*   **Impact Metrics**: Scroll-triggered counting animations (e.g., 5.2M+ Daily Data Points).
*   **Impact Metrics**: Scroll-triggered counting animations (e.g., 5.2M+ Daily Data Points).

### 2. The Live Intelligence Dashboard (`/dashboard`)
The core user interface for monitoring the city's air quality in real-time. It features a responsive sidebar network and a densely packed grid of data visualizations.

#### 📊 Exactly What Data Is Shown on the Dashboard?

1.  **Overview Metrics (`OverviewCards.tsx`)**:
    *   **Current City AQI**: The baseline macro average (e.g., *154 PM2.5*). Includes a sparkline chart showing the last 6 hours, trend indicators (e.g., *+12%*), and status text (*Poor*).
    *   **Most Polluted Ward**: AirLens identification of the worst zone in real-time (e.g., *Bandra W - AQI 182*, alongside the cause like *Traffic Spike*).
    *   **Primary Source**: The leading cause of the current pollution index (e.g., *Vehicular Emission contributing 42%*), tracked against yesterday's data.
    *   **24h Prediction**: The forecasted state of the air for tomorrow, powered by the ML models (e.g., *Expected AQI 120, Improving due to expected light rain*).

2.  **Live Spatial Mapping (`AQIMapFeature.tsx`)**:
    *   A radar-style visualization of the city grid.
    *   Plots individual, glowing sensor nodes categorized by severity (Emerald = Good, Rose = Critical).
    *   Displays sweeping radar blips to simulate live data ingestion.

3.  **Pollutant Breakdown (`PollutionSourcesPanel.tsx`)**:
    *   A multi-layered progress bar breaking down the exact chemical composition of the air.
    *   Tracks: **PM2.5 (Particulate Matter)**, **PM10**, **NO2 (Nitrogen Dioxide)**, and **O3 (Ozone)**.
    *   Marks safety thresholds on the meters to show how close the air is to hazardous levels.

4.  **LSTM Forecasting Chart (`PredictionChart.tsx`)**:
    *   A beautiful, dual-axis composed chart showing historical data merging into predicted future data.
    *   Plots the **Observed AQI** (solid line) against the AI's **Predicted AQI** (dashed line).
    *   Also overlays **Confidence Intervals** (shaded areas around the prediction) so the user knows the reliability of the forecast.

5.  **Critical Alerts Feed (`AlertsPanel.tsx`)**:
    *   A streaming list of localized events.
    *   Shows actionable notifications like: *"PM2.5 levels exceeding safe limits in Industrial Zone Phase 2"* or *"Significant reduction in Nitrogen Dioxide detected near Central Park."*

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **UI Library**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Charting**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

To run the frontend visualization locally:

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **View the Application**
   Open [http://localhost:3020](http://localhost:3020) (or the port specified in your terminal) in your browser.

---

*Built with precision for the future of urban environmental monitoring.*
