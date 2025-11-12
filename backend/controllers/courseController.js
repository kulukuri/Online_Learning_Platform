const Course = require("../models/Course");

exports.getCourses = async (req, res) => {
  const search = req.query.search || "";
  try {
    const courses = await Course.find({
      title: { $regex: search, $options: "i" }
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createCourse = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  const { title, description, videoUrl, paragraphs } = req.body;
  try {
    const course = new Course({
      title,
      description,
      videoUrl,
      paragraphs,
    });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteCourse = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: "Course deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
