const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const auth = require('../middlewares/authMiddleware');

// GET all announcements (public)
router.get('/', announcementController.getAnnouncements);

// POST create announcement (admin only)
router.post('/', auth, announcementController.createAnnouncement);

// DELETE announcement by ID (admin only)
router.delete('/:id', auth, announcementController.deleteAnnouncement);

module.exports = router;
