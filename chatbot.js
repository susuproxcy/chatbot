const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatbox = document.getElementById("chatbox");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  appendMessage("You", message);
  userInput.value = "";

  const response = await getChatbotResponse(message);
  appendMessage("Chatbot", response);
}

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function getChatbotResponse(message) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const apiKey = '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';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',  // Specify GPT-3.5-turbo model
        messages: [{ role: 'user', content: message }],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`HTTP error! status: ${response.status}. Details: ${errorMessage}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error during API request:', error);
    appendMessage("Chatbot", `Error: ${error.message}`);
    return "Sorry, there was an error processing your request.";
  }
}
