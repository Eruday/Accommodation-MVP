const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  messages: [messageSchema],
  lastMessage: {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }
}, { timestamps: true });

// Index for fast lookup by participant and room (not unique — multikey unique index
// on array fields blocks multiple users from messaging the same room)
chatSchema.index({ participants: 1, room: 1 });

module.exports = mongoose.model('Chat', chatSchema);