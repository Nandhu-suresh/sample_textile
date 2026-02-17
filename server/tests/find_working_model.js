require('dotenv').config();
const axios = require('axios');

async function findWorkingModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        console.log("Fetching available models...");
        const response = await axios.get(listUrl);
        const models = response.data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace('models/', '')); // Remove 'models/' prefix for use in ID

        console.log(`Found ${models.length} candidates. Testing each...`);

        for (const model of models) {
            process.stdout.write(`Testing ${model} ... `);
            const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            try {
                await axios.post(genUrl, {
                    contents: [{ parts: [{ text: "Hi" }] }]
                });
                console.log("SUCCESS! ✅");
                console.log(`\n>>> RECOMMENDED FIX: Use model "${model}" <<<\n`);
                return; // Stop after first success
            } catch (err) {
                console.log(`Failed (${err.response?.status || err.message}) ❌`);
            }
        }
        console.log("No working models found.");
    } catch (error) {
        console.error("Fatal Error:", error.message);
    }
}

findWorkingModel();
