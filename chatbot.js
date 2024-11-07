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
        model: 'gpt-4-turbo',  // Specify 'gpt-4-turbo'
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
