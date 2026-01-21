const express = require('express');
const router = express.Router();
const syllabusController = require('../controllers/syllabusController');

// Visitor Routes
router.get('/visitor', syllabusController.getVisitorCount);
router.post('/visitor/increment', syllabusController.incrementVisitorCount);

// Contact Routes
router.post('/contact', syllabusController.submitContact);

// Guestbook Routes
router.get('/guestbook', syllabusController.getGuestbookEntries);
router.post('/guestbook', syllabusController.addGuestbookEntry);

module.exports = router;
