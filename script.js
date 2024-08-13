const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        const message = input.value;
        addMessage(message, 'user');
        socket.emit('chat message', message);
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    if (msg.startsWith('AI: ')) {
        addMessage(msg.substring(4), 'ai');
    } else {
        addMessage(msg, 'user');
    }
});

function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    const messageContent = document.createElement('p');
    messageContent.textContent = message;

    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = new Date().toLocaleTimeString();

    const avatar = document.createElement('img');
    avatar.classList.add('avatar');
    avatar.src = sender === 'user' ? 'https://via.placeholder.com/40/4CAF50/FFFFFF?text=U' : 'https://via.placeholder.com/40/000000/FFFFFF?text=AI';

    if (sender === 'user') {
        messageElement.appendChild(timestamp);
        messageElement.appendChild(messageContent);
        messageElement.appendChild(avatar);
    } else {
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
        messageElement.appendChild(timestamp);
    }

    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}
