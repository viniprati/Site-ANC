const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true }, // 'user' ou 'admin'
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    status: { type: String, default: 'open' }, // 'open', 'closed'
    messages: [messageSchema]
});

module.exports = mongoose.model('Chat', chatSchema);