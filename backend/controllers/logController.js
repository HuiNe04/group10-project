// controllers/logController.js
const Log = require("../models/Log");

// ✅ Lấy tất cả log (Admin Only)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate("userId", "name email role").sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("❌ Lỗi lấy log:", error.message);
    res.status(500).json({ message: "Lỗi server khi lấy logs" });
  }
};

// ✅ Lấy log theo user
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.params.id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("❌ Lỗi lấy log user:", error.message);
    res.status(500).json({ message: "Lỗi server khi lấy log người dùng" });
  }
};
