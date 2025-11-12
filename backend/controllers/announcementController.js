const Announcement = require("../models/Announcement");

// Get all announcements (public)
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Create announcement (admin only)
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

// Delete announcement (admin only)
exports.deleteAnnouncement = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Announcement not found" });
    res.json({ msg: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
