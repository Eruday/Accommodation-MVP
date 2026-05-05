const Favorite = require('../models/Favorite');
const Room = require('../models/Room');

// Add to favorites
const addFavorite = async (req, res) => {
  const { roomId } = req.body;
  try {
    const favorite = await Favorite.create({ userId: req.user.id, roomId });
    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error
      res.status(400).json({ message: 'Already in favorites' });
    } else {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
  const { roomId } = req.params;
  try {
    await Favorite.findOneAndDelete({ userId: req.user.id, roomId });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user's favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).populate('roomId');
    const rooms = favorites.map(fav => fav.roomId).filter(room => room); // Filter out null rooms
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Check if room is favorited by user
const isFavorite = async (req, res) => {
  const { roomId } = req.params;
  try {
    const favorite = await Favorite.findOne({ userId: req.user.id, roomId });
    res.json({ isFavorite: !!favorite });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites, isFavorite };