const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  message: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional, if user is logged in
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);