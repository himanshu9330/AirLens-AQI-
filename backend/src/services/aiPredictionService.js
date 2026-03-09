const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

class AiPredictionService {
    constructor() {
        // Initialize Gemini client only if API key is present
        this.ai = null;
        if (process.env.GEMINI_API_KEY) {
            this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        }
    }

    /**
     * Generate a 24-hour AQI forecast using Gemini LLM
     * @param {number} currentAqi - The current aggregate AQI
     * @param {string} primarySource - The primary pollution source
     * @param {Array<number>} recentHistory - array of last few hours of AQI to show the trend
     * @returns {Promise<Array<number> | null>} Array of 24 predicted AQI values, or null if failed/not configured
     */
    async generate24HourForecast(currentAqi, primarySource, recentHistory) {
        if (!this.ai) {
            logger.warn('GEMINI_API_KEY is not configured. Falling back to deterministic predictions.');
            return null;
        }

        try {
            logger.info('Requesting 24-hour national forecast from Gemini LLM...');

            const prompt = `You are an expert environmental AI model forecasting national Air Quality Index (AQI).
Context:
- The current national average AQI is: ${currentAqi}
- The primary pollution source at the moment is: ${primarySource}
- Recent hourly historical AQI values (oldest to newest): ${recentHistory.join(', ')}

Task: Predict the average national AQI for the next 24 hours, hour by hour. Consider natural diurnal cycles (e.g., pollution often peaks in early morning and late evening, clearing somewhat during midday). 
Factor in the current trend from the recent history.

Output Format: You MUST output ONLY a valid JSON array containing exactly 24 integers representing the predicted AQI for the next 24 hours (e.g. [120, 125, 130, 115, ...]). Do not include any text, reasoning, or markdown formatting blocks (\`\`\`json). Just the raw array string.`;

            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    temperature: 0.3,
                }
            });

            let text = response.text.trim();

            // Clean up any potential markdown formatting the LLM might have ignored
            if (text.startsWith('```json')) {
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            } else if (text.startsWith('```')) {
                text = text.replace(/```/g, '').trim();
            }

            const forecastArray = JSON.parse(text);

            if (Array.isArray(forecastArray) && forecastArray.length === 24 && forecastArray.every(v => typeof v === 'number')) {
                logger.info('Successfully generated LLM 24-hour forecast.');
                return forecastArray;
            } else {
                logger.error('LLM returned an invalid format: ' + text);
                return null;
            }

        } catch (error) {
            logger.error('Failed to generate LLM forecast: ' + error.message);
            return null;
        }
    }

    /**
     * Generate Actionable AI Recommendations for specific states
     * @param {Array<Object>} stateData - Array containing state names, AQI, and primary source
     * @returns {Promise<Array<Object> | null>} Array of alert objects
     */
    async generateStateRecommendations(stateData) {
        if (!this.ai) {
            // Deterministic fallback if no API key
            return stateData.map((state, idx) => {
                let action = "Monitor AQI levels closely.";
                if (state.source.includes('Vehicular')) action = "Enforce stricter traffic controls in high congestion zones.";
                if (state.source.includes('Industrial')) action = "Deploy mobile smog towers near manufacturing hubs.";
                if (state.source.includes('Construction')) action = "Halt non-essential construction and mandate water sprinkling.";
                if (state.source.includes('Biomass')) action = "Increase patrols to prevent illegal crop burning.";

                return {
                    id: `alert-${idx}`,
                    title: `${state.aqi > 150 ? 'Severe' : 'Moderate'} Alert: ${state.name}`,
                    description: `Primary source detected as ${state.source}. ${action}`,
                    time: 'Live',
                    type: state.aqi > 150 ? 'severe' : 'moderate'
                }
            });
        }

        try {
            logger.info('Requesting state recommendations from Gemini LLM...');
            const prompt = `You are an expert environmental AI advisor for a national EPA dashboard.
Context:
I am providing you with data for 3 Indian states that currently have high AQI.
Data: ${JSON.stringify(stateData)}

Task:
For each state, write a single highly actionable, strategic policy recommendation (max 2 sentences) to mitigate the specific primary source of their pollution.

Output Format:
You MUST output ONLY a valid JSON array of objects. Do not include markdown \`\`\`json blocks.
Format exactly like this:
[
  {
    "id": "alert-0",
    "title": "Severe Alert: [State Name]",
    "description": "[Your strategic 2-sentence actionable recommendation based strictly on their primary source]",
    "time": "Live",
    "type": "[severe if AQI>150, else moderate]"
  }
]`;

            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { temperature: 0.4 }
            });

            let text = response.text.trim();
            if (text.startsWith('```json')) text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            else if (text.startsWith('```')) text = text.replace(/```/g, '').trim();

            const recommendations = JSON.parse(text);

            if (Array.isArray(recommendations) && recommendations.length > 0) {
                return recommendations;
            }
            return null;
        } catch (error) {
            logger.error('Failed to generate state recommendations: ' + error.message);
            return null;
        }
    }
}

module.exports = new AiPredictionService();
