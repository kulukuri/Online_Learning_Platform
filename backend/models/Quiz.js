const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [
    {
      text: String,
      options: [String],
      answer: Number // index of correct option
    }
  ]
});

module.exports = mongoose.model("Quiz", quizSchema);
