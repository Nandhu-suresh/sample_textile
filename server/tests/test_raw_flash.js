require('dotenv').config();
const axios = require('axios');

async function testFlash() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "Hello" }] }]
        });
        console.log("Success:", response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error("Error Status:", error.response?.status);
        console.error("Error Message:", error.response?.data?.error?.message);
    }
}

testFlash();
