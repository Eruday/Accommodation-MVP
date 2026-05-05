const Room = require('../models/Room');

const postRoom = async (req, res) => {
  // ── ADDED: destructure new fields ───────────────────────────
  const {
    title, price, location, contactEmail, contactPhone,
    address, securityDeposit, roomType, furnishing, availableFrom,
    minStay, additionalNotes, amenities, anmeldung, status
  } = req.body;
  // ───────────────────────────────────────────────────────

  const images = req.files ? req.files.map(f => f.filename) : [];

  // ── ADDED: simple validation for new required fields ────────
  if (!roomType || !furnishing || !availableFrom) {
    return res.status(400).json({ message: 'roomType, furnishing, and availableFrom are required' });
  }
  if (anmeldung === undefined || anmeldung === null || anmeldung === '') {
    return res.status(400).json({ message: 'anmeldung is required' });
  }
  // ────────────────────────────────────────────────────────────

  try {
    const room = await Room.create({
      title,
      price,
      location,
      address: address || location,  // Default to location if not provided
      images,
      contact: { email: contactEmail, phone: contactPhone },
      postedBy: req.user.id,
      securityDeposit: securityDeposit || 0,
      roomType,
      furnishing,
      availableFrom,
      minStay: minStay || undefined,
      additionalNotes: additionalNotes || undefined,
      amenities: amenities ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : [],
      anmeldung: anmeldung === 'true' || anmeldung === true,
      status: ['available', 'occupied'].includes(status) ? status : 'available'
    });
    res.status(201).json({ message: 'Room posted successfully', room });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getRooms = async (req, res) => {
  const filter = { status: 'available' }; // hide occupied rooms from public listing
  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: 'i' };
  }
  if (req.query.roomType) {
    filter.roomType = req.query.roomType;
  }
  if (req.query.furnishing) {
    filter.furnishing = req.query.furnishing;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.availableFrom) {
    filter.availableFrom = { $gte: new Date(req.query.availableFrom) };
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

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Check if user owns the room
    if (room.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this room' });
    }

    // Update only provided fields
    const allowedFields = [
      'title', 'price', 'location', 'address', 'contactEmail', 'contactPhone',
      'roomType', 'furnishing', 'availableFrom', 'minStay', 'additionalNotes',
      'amenities', 'securityDeposit', 'anmeldung', 'status'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'amenities') {
          updates[field] = req.body[field] ? JSON.parse(req.body[field]) : [];
        } else if (field === 'anmeldung') {
          updates[field] = req.body[field] === 'true' || req.body[field] === true;
        } else if (field === 'contactEmail') {
          if (!updates.contact) updates.contact = room.contact || {};
          updates.contact.email = req.body[field];
        } else if (field === 'contactPhone') {
          if (!updates.contact) updates.contact = room.contact || {};
          updates.contact.phone = req.body[field];
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    // Handle new images if provided
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.filename);
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Room updated successfully', room: updatedRoom });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Check if user owns the room
    if (room.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    room.status = room.status === 'available' ? 'occupied' : 'available';
    await room.save();
    res.json({ message: 'Status updated', status: room.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { postRoom, getRooms, getRoomById, getMyRooms, updateRoom, deleteRoom, toggleStatus };
