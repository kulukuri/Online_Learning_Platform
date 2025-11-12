const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const auth = require('../middlewares/authMiddleware');

// Get quizzes by course
router.get('/:courseId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin add quiz
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin delete quiz
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Quiz removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
