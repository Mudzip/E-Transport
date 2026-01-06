const express = require('express');
const { getHistory, addHistory } = require('../controllers/historyController.js');

const router = express.Router();

router.get('/', getHistory);
router.post('/', addHistory);

module.exports = router;
