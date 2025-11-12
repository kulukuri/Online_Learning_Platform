const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middlewares/authMiddleware');

// Get all quizzes for dashboard and student view
router.get('/', quizController.getAllQuizzes);

// Get quizzes by course ID
router.get('/:courseId', quizController.getQuizzesByCourse);

// Admin add quiz
router.post('/', auth, quizController.createQuiz);

// Admin delete quiz
router.delete('/:id', auth, quizController.deleteQuiz);

// Admin add a question to a quiz
router.post('/:id/questions', auth, quizController.addQuestion);

module.exports = router;
