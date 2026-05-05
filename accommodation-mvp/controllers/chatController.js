const Message = require('../models/Message');
const Room = require('../models/Room');

let io;
const setIo = (socketIo) => { io = socketIo; };
module.exports.setIo = setIo;

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const senderId = req.user.id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.postedBy) return res.status(400).json({ message: 'Room owner information is missing. Please re-post this room.' });

    const newMessage = await Message.create({
      sender: senderId,
      receiver: room.postedBy,
      roomId,
      message: message.trim()
    });

    if (io) {
      io.to(`chat_${roomId}`).emit('new-message', { messageId: newMessage._id });
    }

    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({
      roomId,
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
