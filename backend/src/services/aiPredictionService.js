const Groq = require('groq-sdk');
const logger = require('../utils/logger');

class AiPredictionService {
    constructor() {
        // Initialize Groq client only if API key is present
        this.groq = null;
        if (process.env.GROQ_API_KEY) {
            this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        }
    }

    /**
     * Generate a 24-hour AQI forecast using Groq LLM
     * @param {number} currentAqi - The current aggregate AQI
     * @param {string} primarySource - The primary pollution source
     * @param {Array<number>} recentHistory - array of last few hours of AQI to show the trend
     * @returns {Promise<Array<number> | null>} Array of 24 predicted AQI values, or null if failed/not configured
     */
    async generate24HourForecast(currentAqi, primarySource, recentHistory) {
        if (!this.groq) {
            logger.warn('GROQ_API_KEY is not configured. Falling back to deterministic predictions.');
            return null;
        }

        try {
            logger.info('Requesting 24-hour national forecast from Groq LLM...');

            const prompt = `You are an expert environmental AI model forecasting national Air Quality Index (AQI).
Context:
- The current national average AQI is: ${currentAqi}
- The primary pollution source at the moment is: ${primarySource}
- Recent hourly historical AQI values (oldest to newest): ${recentHistory.join(', ')}

Task: Predict the average national AQI for the next 24 hours, hour by hour. Consider natural diurnal cycles (e.g., pollution often peaks in early morning and late evening, clearing somewhat during midday). 
Factor in the current trend from the recent history.

Output Format: You MUST output ONLY a valid JSON object with a single key "forecast" pointing to an array containing exactly 24 integers representing the predicted AQI for the next 24 hours. Do not include any text, reasoning, or markdown formatting blocks.
Format example: {"forecast": [120, 125, 130, 115, ...]}`;

            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "llama3-8b-8192",
                temperature: 0.3,
                response_format: { type: "json_object" }
            });

            let text = completion.choices[0]?.message?.content || "";
            text = text.trim();

            const parsed = JSON.parse(text);
            const forecastArray = parsed.forecast;

            if (Array.isArray(forecastArray) && forecastArray.length === 24 && forecastArray.every(v => typeof v === 'number')) {
                logger.info('Successfully generated Groq 24-hour forecast.');
                return forecastArray;
            } else {
                logger.error('Groq returned an invalid format: ' + text);
                return null;
            }

        } catch (error) {
            logger.error('Failed to generate Groq forecast: ' + error.message);
            return null;
        }
    }

    /**
     * Generate Actionable AI Recommendations for specific states
     * @param {Array<Object>} stateData - Array containing state names, AQI, and primary source
     * @returns {Promise<Array<Object> | null>} Array of alert objects
     */
    async generateStateRecommendations(stateData) {
        if (!this.groq) {
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
            logger.info('Requesting state recommendations from Groq LLM...');
            const prompt = `You are an expert environmental AI advisor for a national EPA dashboard.
Context:
I am providing you with data for 3 Indian states that currently have high AQI.
Data: ${JSON.stringify(stateData)}

Task:
For each state, write a single highly actionable, strategic policy recommendation (max 2 sentences) to mitigate the specific primary source of their pollution.

Output Format:
You MUST output ONLY a valid JSON object with a single key "recommendations" that contains an array of objects. Do not include markdown \`\`\`json blocks.
Format exactly like this:
{
  "recommendations": [
    {
      "id": "alert-0",
      "title": "Severe Alert: [State Name]",
      "description": "[Your strategic 2-sentence actionable recommendation based strictly on their primary source]",
      "time": "Live",
      "type": "[severe if AQI>150, else moderate]"
    }
  ]
}`;

            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "llama3-8b-8192",
                temperature: 0.4,
                response_format: { type: "json_object" }
            });

            let text = completion.choices[0]?.message?.content || "";
            text = text.trim();

            const parsed = JSON.parse(text);
            const recommendations = parsed.recommendations;

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
