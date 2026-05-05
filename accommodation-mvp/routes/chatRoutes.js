const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// All chat routes require authentication
router.use(authMiddleware);

// Send a message
router.post('/send', chatController.sendMessage);

// Get chat messages for a specific room
router.get('/room/:roomId', chatController.getChatMessages);


module.exports = router;