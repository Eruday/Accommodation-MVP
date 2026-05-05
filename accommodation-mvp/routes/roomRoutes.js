const express = require('express');
const multer = require('multer');
const { postRoom, getRooms, getRoomById, getMyRooms, updateRoom, deleteRoom, toggleStatus } = require('../controllers/roomController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/',     protect, upload.array('images', 3), postRoom);
router.get('/my-rooms', protect, getMyRooms);
router.get('/',     getRooms);
router.get('/:id',  getRoomById);
router.put('/:id',  protect, upload.array('images', 3), updateRoom);
router.delete('/:id', protect, deleteRoom);
router.patch('/:id/status', protect, toggleStatus);

module.exports = router;
