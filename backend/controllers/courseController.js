const Course = require("../models/Course");

// Get all courses for students/admin with optional search
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

// Create a new course (admin only)
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

// Delete course by ID (admin only)
exports.deleteCourse = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Course not found" });
    res.json({ msg: "Course deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get single course by ID (any authenticated user)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
