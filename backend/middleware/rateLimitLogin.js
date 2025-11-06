// middleware/rateLimitLogin.js
const rateLimit = require("express-rate-limit");

// ✅ Chặn brute-force login: mỗi IP chỉ được 5 lần / 5 phút
exports.loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 phút
  max: 5, // cho phép 5 lần thử
  message: {
    message: "⚠️ Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 5 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});