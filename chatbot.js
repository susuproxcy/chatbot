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
  userInput.value = ""; // Clear the input field

  // Add an alert to show that the message is being sent
  alert("Sending message to API: " + message);

  const response = await getChatbotResponse(message);
  
  // Add an alert to show the response from the chatbot
  alert("Response from API: " + response);

  appendMessage("Chatbot", response);
}

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function getChatbotResponse(message) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';  // URL for chat completions
  const apiKey = ' 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';  // Replace with your OpenAI API key

  try {
    alert("Making API request...");

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,  // Use your API key
      },
      body: JSON.stringify({
        model: 'gpt-4',  // Or 'gpt-3.5-turbo' for cheaper alternatives
        messages: [
          { role: 'user', content: message }  // User's input message
        ],
        max_tokens: 150,  // Limit the length of the response
      }),
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    alert("API response received: " + JSON.stringify(data));  // Show the response

    // If response is valid, return the chatbot's reply
    return data.choices[0].message.content.trim();
  } catch (error) {
    alert("Error: " + error);  // Show the error message
    appendMessage("Chatbot", "Sorry, there was an error processing your request.");
    return "Error: Unable to fetch response.";
  }
}
