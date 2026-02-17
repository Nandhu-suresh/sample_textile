const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API Key not configured' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `You are a helpful assistant for a Boutique Textile Shop. 
        You answer questions about our products (Sarees, Salwars, Churidars).
        Be polite, concise, and helpful. If you don't know something, suggest contacting support.`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to assist your customers with their textile queries." }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error('Chat Error:', error);
        if (error.response) {
            console.error('Error Response:', error.response);
        }
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

module.exports = router;
