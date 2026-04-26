const express = require('express');
const multer = require('multer');
const { postRoom, getRooms, getRoomById } = require('../controllers/roomController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/',     protect, upload.single('image'), postRoom);
router.get('/',     getRooms);
router.get('/:id',  getRoomById);

module.exports = router;
