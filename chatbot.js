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
  const apiKey = 'YOUR_OPENAI_API_KEY';  // Replace with your OpenAI API key

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

  const data = await response.json();
  return data.choices[0].message.content.trim();  // Get and return the response
}
