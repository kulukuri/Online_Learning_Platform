const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middlewares/authMiddleware');

// Get user profile (with populated courses)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('courses');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Enroll in a course (add to student's courses)
router.post('/enroll/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { courses: course._id } },
      { new: true }
    ).populate('courses');
    res.json({ msg: 'Course added', user });
  } catch (err) {
    res.status(500).json({ msg: 'Error enrolling course' });
  }
});

// Update profile settings
router.put('/profile', auth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
