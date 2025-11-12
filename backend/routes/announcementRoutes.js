const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const auth = require('../middlewares/authMiddleware');

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin add announcement
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin delete announcement
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Announcement removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
