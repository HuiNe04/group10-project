// middleware/logActivity.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Log = require("../models/Log");

exports.logActivity = async (req, res, next) => {
  try {
    // 🧠 Nếu chưa có req.user (ví dụ middleware chưa gắn user), thử decode token để xác định người dùng
    if (!req.user && req.headers.authorization?.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
      } catch {
        // Nếu token lỗi thì không sao — log vẫn ghi "Guest"
      }
    }

    // ✅ Lấy thông tin user sau khi xác định
    const user = req.user || null;

    // ✅ Lấy IP thật (Render hoặc local)
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.ip;

    // ✅ Ghi log vào MongoDB
    await Log.create({
      userId: user ? user._id : null,
      action: `${req.method} ${req.originalUrl}`,
      ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date(),
    });

    // ✅ In log ra console để theo dõi dễ trên Render
    console.log(
      `📝 Logged: ${req.method} ${req.originalUrl} (${user ? user.name : "Guest"}) [IP: ${ip}]`
    );
  } catch (error) {
    console.error("❌ Lỗi ghi log:", error.message);
  }

  next();
};
