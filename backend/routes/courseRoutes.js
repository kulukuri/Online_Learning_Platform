const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middlewares/authMiddleware');

// GET all courses (public or authenticated as needed)
router.get('/', courseController.getCourses);

// GET single course by ID (authenticated only)
router.get('/:id', auth, courseController.getCourseById);

// POST create new course (admin only)
router.post('/', auth, courseController.createCourse);

// DELETE course by ID (admin only)
router.delete('/:id', auth, courseController.deleteCourse);

module.exports = router;
