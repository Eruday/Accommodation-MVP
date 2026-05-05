const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

const sendContactMessage = async (req, res) => {
  const { senderName, senderEmail, message, roomId } = req.body;

  if (!senderName || !senderEmail || !message || !roomId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    await Message.create({
      sender: req.user ? req.user.id : undefined,
      receiver: room.postedBy,
      roomId,
      message,
      senderName,
      senderEmail
    });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getOwnerMessages = async (req, res) => {
  try {
    // Return all messages where the logged-in user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('roomId', 'title location')
      .sort({ createdAt: 1 }); // oldest first so threads read top-to-bottom
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const replyToMessage = async (req, res) => {
  const { receiverId, roomId, message } = req.body;

  if (!receiverId || !roomId || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const sender = await User.findById(req.user.id).select('name email');
    if (!sender) return res.status(404).json({ message: 'Sender not found' });

    await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      roomId,
      message,
      senderName: sender.name,
      senderEmail: sender.email
    });

    res.status(201).json({ message: 'Reply sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { sendContactMessage, getOwnerMessages, replyToMessage };
