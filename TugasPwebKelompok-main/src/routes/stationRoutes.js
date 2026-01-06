const express = require('express');
const { getAllStations, searchStations } = require('../controllers/stationController.js');

const router = express.Router();

router.get('/', getAllStations);
router.get('/search', searchStations);

module.exports = router;
