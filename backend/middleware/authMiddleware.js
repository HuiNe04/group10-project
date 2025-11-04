// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ Không có header Authorization
    if (!authHeader)
      return res.status(401).json({ message: "Thiếu token trong header" });

    // Lấy token sau chữ 'Bearer'
    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token không hợp lệ" });

    // ✅ Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    // Lưu thông tin user vào req để các controller phía sau có thể dùng
    req.user = decoded;

    console.log("✅ Xác thực token thành công cho user:", decoded.id);
    next();
  } catch (error) {
    console.error("❌ Token lỗi hoặc hết hạn:", error.message);
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
