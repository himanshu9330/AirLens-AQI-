const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not found in .env');
        return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const model = 'models/gemini-flash-latest';
        console.log(`Testing prediction with model: ${model}`);
        const response = await ai.models.generateContent({
            model: model,
            contents: 'Say "Working!"'
        });
        console.log('Response:', response.text);
    } catch (error) {
        console.error('Prediction failed:', error.message);
        if (error.response) {
            console.error('Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

listModels();
