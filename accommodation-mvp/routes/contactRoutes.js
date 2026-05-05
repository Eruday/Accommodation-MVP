const express = require('express');
const { sendContactMessage, getOwnerMessages } = require('../controllers/contactController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Send contact message (no auth required for sending)
router.post('/', sendContactMessage);

// Get owner's messages (requires auth)
router.get('/owner', protect, getOwnerMessages);

module.exports = router;