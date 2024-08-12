require('dotenv').config(); 

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const OpenAI = require('openai');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const { handleErrors } = require('./middlewares/errorHandler');
const { initializeAI, handleChatMessage } = require('./services/aiService');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

const openai = initializeAI(process.env.API_KEY);

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('chat message', async (msg) => {
        try {
            const aiReply = await handleChatMessage(openai, msg);
            io.emit('chat message', `AI: ${aiReply}`);
        } catch (error) {
            console.error('Error with OpenAI API:', error);
            io.emit('chat message', 'AI: Sorry, I am having trouble responding right now.');
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.use(handleErrors);

const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

server.listen(PORT, () => {
    console.log(`Server running in ${ENVIRONMENT} mode on port ${PORT}`);
});
