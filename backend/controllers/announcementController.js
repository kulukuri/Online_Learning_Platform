const Announcement = require("../models/Announcement");

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.createAnnouncement = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ msg: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
