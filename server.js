require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // To make API calls
const app = express();
const PORT = 3000;

require('dotenv').config(); // Load .env variables

app.use(express.json()); // Parse JSON bodies

app.post('/get-response', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Use the appropriate model
                messages: [{ role: 'user', content: userMessage }],
            })
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
