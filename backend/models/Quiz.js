const mongoose = require('mongoose');
const QuizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [
    {
      text: String,
      options: [String],
      answer: Number
    }
  ],
});
module.exports = mongoose.model('Quiz', QuizSchema);
