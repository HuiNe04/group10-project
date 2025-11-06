// middleware/logActivity.js
const Log = require("../models/Log");

// ✅ Middleware ghi log mỗi khi có hành động
exports.logActivity = async (req, res, next) => {
  try {
    // Nếu chưa có user (ví dụ login trước khi auth) → bỏ qua
    const userId = req.user ? req.user.id : null;

    const log = new Log({
      userId,
      action: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date(),
    });

    await log.save();
    console.log(`📝 Logged: ${req.method} ${req.originalUrl} (${userId || "Guest"})`);
  } catch (error) {
    console.error("❌ Lỗi ghi log:", error.message);
  }
  next();
};