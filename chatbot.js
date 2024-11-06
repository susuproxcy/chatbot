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
  const apiUrl = 'https://api.openai.com/v1/chat/completions';  // Correct URL for chat completions
  const apiKey = ' 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';  // Replace with your OpenAI API key

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,  // Use your API key
      },
      body: JSON.stringify({
        model: 'gpt-4',  // You can replace with a different model like "gpt-3.5-turbo"
        messages: [
          { role: 'user', content: message }  // Your input message
        ],
        max_tokens: 150  // Set how long the response can be
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response from OpenAI:', data); // Log the full response for debugging
    return data.choices[0].message.content.trim();  // Get and return the response
  } catch (error) {
    console.error('Error during API request:', error);
    appendMessage("Chatbot", "Sorry, there was an error processing your request.");
    return "Error: Unable to fetch response.";
  }
}
