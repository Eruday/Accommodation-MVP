const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  message: { type: String, required: true },
  senderName: String,
  senderEmail: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
