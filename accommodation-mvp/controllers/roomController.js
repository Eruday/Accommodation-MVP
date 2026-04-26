const Room = require('../models/Room');

const postRoom = async (req, res) => {
  // ── ADDED: destructure new fields ───────────────────────────
  const {
    title, price, location, contactEmail, contactPhone,
    securityDeposit, roomType, furnishing, availableFrom,
    minStay, additionalNotes
  } = req.body;
  // ────────────────────────────────────────────────────────────

  const image = req.file ? req.file.filename : '';

  // ── ADDED: simple validation for new required fields ────────
  if (!roomType || !furnishing || !availableFrom) {
    return res.status(400).json({ message: 'roomType, furnishing, and availableFrom are required' });
  }
  // ────────────────────────────────────────────────────────────

  try {
    const room = await Room.create({
      title,
      price,
      location,
      image,
      contact: { email: contactEmail, phone: contactPhone },
      postedBy: req.user.id,
      // ── ADDED: save new fields ───────────────────────────────
      securityDeposit: securityDeposit || 0,
      roomType,
      furnishing,
      availableFrom,
      minStay:         minStay || undefined,
      additionalNotes: additionalNotes || undefined
      // ────────────────────────────────────────────────────────
    });
    res.status(201).json({ message: 'Room posted successfully', room });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getRooms = async (req, res) => {
  const filter = {};
  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: 'i' };
  }
  try {
    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('postedBy', 'name');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { postRoom, getRooms, getRoomById };
