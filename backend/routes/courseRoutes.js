const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middlewares/authMiddleware');

// GET all courses, with optional search
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// GET single course by ID (place below the above!)
router.get('/:id', auth, async (req, res) => {
  console.log("Requested course ID:", req.params.id); // Add debugging log
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      console.log("Course not found in DB");
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create course (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE course (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
