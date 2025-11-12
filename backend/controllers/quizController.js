const Quiz = require("../models/Quiz");

// Get ALL quizzes (for dashboard, etc.)
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get quizzes by course ID
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Create quiz (admin only)
exports.createQuiz = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete quiz by ID (admin only)
exports.deleteQuiz = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    const deleted = await Quiz.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Quiz not found" });
    res.json({ msg: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Add question to quiz (admin only)
exports.addQuestion = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    quiz.questions.push(req.body.question);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
