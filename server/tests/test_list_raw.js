require('dotenv').config();
const axios = require('axios');

const fs = require('fs');

async function listModelsRaw() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        let output = `Status: ${response.status}\nAvailable Generative Models:\n`;
        response.data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                output += `- ${m.name}\n`;
            }
        });
        fs.writeFileSync('models.txt', output);
        console.log("Written to models.txt");
    } catch (error) {
        console.error("Error Status:", error.response?.status);
        console.error("Error Message:", error.response?.data?.error?.message);
    }
}

listModelsRaw();
