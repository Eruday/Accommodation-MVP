require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const contactRoutes = require('./routes/contactRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatController = require('./controllers/chatController');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

connectDB();

// Set Socket.IO instance for chat controller
chatController.setIo(io);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room-specific chat
  socket.on('join-chat', (roomId) => {
    socket.join(`chat_${roomId}`);
    console.log(`User ${socket.id} joined chat room: ${roomId}`);
  });

  // Leave chat room
  socket.on('leave-chat', (roomId) => {
    socket.leave(`chat_${roomId}`);
    console.log(`User ${socket.id} left chat room: ${roomId}`);
  });

  // Handle new message
  socket.on('send-message', (data) => {
    // Broadcast to all users in the chat room
    io.to(`chat_${data.roomId}`).emit('new-message', data.message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
