const express = require('express');
const { addFavorite, removeFavorite, getFavorites, isFavorite } = require('../controllers/favoriteController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', addFavorite); // POST /api/favorites - add favorite
router.delete('/:roomId', removeFavorite); // DELETE /api/favorites/:roomId - remove favorite
router.get('/', getFavorites); // GET /api/favorites - get user's favorites
router.get('/:roomId/isFavorite', isFavorite); // GET /api/favorites/:roomId/isFavorite - check if favorited

module.exports = router;