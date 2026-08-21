// Replace with your API key from https://makersuite.google.com/app/apikey
const API_KEY = 'YOUR_GEMINI_API_KEY';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to create and append a message element
function appendMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show loading animation
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot';
    loadingDiv.innerHTML = `
        <div class="loading">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

// Function to send message to Gemini AI
async function sendMessageToGemini(message) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    try {
        const response = await fetch(`${url}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

// Handle send button click
async function handleSend() {
    const message = userInput.value.trim();
    if (!message) return;

    // Disable input and button while processing
    userInput.value = '';
    userInput.disabled = true;
    sendButton.disabled = true;

    // Add user message to chat
    appendMessage(message, true);

    // Show loading animation
    const loadingDiv = showLoading();

    // Get response from Gemini
    const response = await sendMessageToGemini(message);

    // Remove loading animation
    loadingDiv.remove();

    // Add bot response to chat
    appendMessage(response);

    // Re-enable input and button
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
}

// Event listeners
sendButton.addEventListener('click', handleSend);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// Initial greeting
appendMessage('Hello! I\'m your AI assistant powered by Gemini. How can I help you today?');