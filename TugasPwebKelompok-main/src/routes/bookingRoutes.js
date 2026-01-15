const express = require('express');
const { createBooking, getBooking } = require('../controllers/bookingController.js');

const router = express.Router();

router.post('/', createBooking);
router.get('/:id', getBooking);
router.get('/user/:userId', require('../controllers/bookingController.js').getUserBookings);

module.exports = router;
