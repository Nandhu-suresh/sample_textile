require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("API Key missing");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Access the model directly if list_models isn't exposed easily in high-level SDK, 
        // but typically we just try a generation. 
        // Actually, the SDK doesn't always expose listModels directly in the main class easily without diving deep.
        // Let's try a standard generation with "gemini-pro" again but ensuring we catch everything.

        console.log("Trying gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-pro");

    } catch (error) {
        console.error("Error details:", error);
        if (error.response) {
            console.error("Response:", error.response);
        }
    }
}

listModels();
