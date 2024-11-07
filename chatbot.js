const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

  const OPENAI_API_KEY = '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'; // Store your API key here securely

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`HTTP error! status: ${response.status}. Details: ${errorMessage}`);
    }

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error during API request:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
