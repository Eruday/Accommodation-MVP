const express = require('express');
const { getOwnerMessages, replyToMessage } = require('../controllers/contactController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getOwnerMessages);      // GET  /api/messages
router.post('/reply', protect, replyToMessage);  // POST /api/messages/reply

module.exports = router;
