async function sendMessage() {
    const userMessage = document.getElementById('user-input').value;

    if (!userMessage) return;

    const messageContainer = document.getElementById('messages');
    messageContainer.innerHTML += `<div>You: ${userMessage}</div>`;
    document.getElementById('user-input').value = '';

    try {
        // Sending the user message to the server (adjust the URL if needed)
        const response = await fetch('/get-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        messageContainer.innerHTML += `<div>Bot: ${data.reply}</div>`;
    } catch (error) {
        console.error('Error:', error);
        messageContainer.innerHTML += `<div>Bot: Sorry, there was an error processing your request.</div>`;
    }
}
