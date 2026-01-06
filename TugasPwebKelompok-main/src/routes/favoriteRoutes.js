const express = require('express');
const {
  getFavorites,
  addFavorite,
  deleteFavorite,
} = require('../controllers/favoriteController.js');

const router = express.Router();

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', deleteFavorite);

module.exports = router;
