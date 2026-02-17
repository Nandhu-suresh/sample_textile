require('dotenv').config();
const axios = require('axios');

const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

const fs = require('fs');

async function listModelsRaw() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Key:", apiKey.substring(0, 5));
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        let output = `Status: ${response.status}\nAvailable Generative Models:\n`;
        response.data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                output += `- ${m.name}\n`;
            }
        });
        fs.writeFileSync('models_list.txt', output);
        console.log("Written to models_list.txt");
    } catch (error) {
        console.error("Error listing models:", error.response?.status, error.response?.data?.error?.message || error.message);
    }
}

listModelsRaw();
