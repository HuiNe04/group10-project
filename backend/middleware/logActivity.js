// middleware/logActivity.js
const Log = require("../models/Log");

exports.logActivity = async (req, res, next) => {
  try {
    const user = req.user || null;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.ip;

    await Log.create({
      userId: user ? user._id : null,
      action: `${req.method} ${req.originalUrl}`,
      ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date(),
    });

    console.log(
      `📝 Logged: ${req.method} ${req.originalUrl} (${user ? user.name : "Guest"}) [IP: ${ip}]`
    );
  } catch (error) {
    console.error("❌ Lỗi ghi log:", error.message);
  }
  next();
};
