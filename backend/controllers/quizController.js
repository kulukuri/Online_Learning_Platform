const Quiz = require("../models/Quiz");

exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

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

exports.deleteQuiz = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ msg: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
