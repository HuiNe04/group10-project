const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ⚠️ Import model User

exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Thiếu token trong header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    // ✅ Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    // ✅ Tìm user thật trong MongoDB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // ✅ Gắn user đầy đủ vào req để các middleware khác (logActivity) dùng được
    req.user = user;

    next();
  } catch (error) {
    console.error("❌ Lỗi xác thực:", error.message);
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
