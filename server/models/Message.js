const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  type: { type: String, default: 'chat' }, // chat, system, error
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);