const express = require("express");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/engines/davinci/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 150
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
