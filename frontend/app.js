
const socket = io('http://localhost:3000');
const chatMessages = document.getElementById('chat-messages');

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
  
    if (message !== '') {
      // Emit the message to the server
      socket.emit('message', { text: message });
  
      // Display the user's message in the chat
      displayMessage('You', message);
  
      // Send the message to the backend
      await sendToBackend(message);
  
      // Clear the input field
      messageInput.value = '';
    }
}

socket.on('message', (data) => {
  // Display the received message in the chat
  displayMessage('Bot', data.text);
});

function displayMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatMessages.appendChild(messageElement);

  // Scroll to the bottom to show the latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send messages to the backend
async function sendToBackend(message) {
  try {
    const response = await fetch('http://localhost:3000/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    displayMessage('Bot', data.reply);
  } catch (error) {
    console.error('Error sending message to backend:', error);
  }
}

async function fetchMessages() {
  try {
    const response = await fetch('http://localhost:3000/getMessages');
    const messages = await response.json();

   
   await messages.forEach(message => {
      if(message.user == "user"){
        displayMessage('You', message.text)
      }
      else{
        displayMessage('Bot', message.text);
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
  }
}
fetchMessages();