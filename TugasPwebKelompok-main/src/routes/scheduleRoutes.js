const express = require('express');
const { getSchedules } = require('../controllers/scheduleController.js');

const router = express.Router();

router.get('/', getSchedules);

module.exports = router;
