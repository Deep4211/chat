const OpenAI = require('openai');

function initializeAI(apiKey) {
    if (!apiKey) {
        throw new Error('OpenAI API key is not provided. Please set the API_KEY in your environment variables.');
    }

    return new OpenAI({
        apiKey: apiKey,
    });
}

async function handleChatMessage(openai, message) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
    });

    return response.choices[0].message.content;
}

module.exports = { initializeAI, handleChatMessage };