const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middlewares/authMiddleware');

// ===============================
// GET ALL COURSES 
// ===============================
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().select("-students"); 
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===============================
// GET SINGLE COURSE BY ID
// ===============================
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ===============================
// ADD COURSE (ADMIN ONLY)
// ===============================
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const newCourse = new Course(req.body);
    await newCourse.save();

    res.json(newCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ===============================
// DELETE COURSE (ADMIN ONLY)
// ===============================
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ msg: "Course deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
