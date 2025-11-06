// middleware/rateLimitLogin.js
const Log = require("../models/Log"); // ✅ Import model Log

// 🧠 Bộ nhớ tạm để theo dõi thất bại theo email
const attempts = new Map(); // key: email, value: { count, lastAttempt }

exports.loginLimiter = async (req, res, next) => {
  const email = req.body.email;
  const now = Date.now();
  const limitTime = 60 * 1000; // 1 phút
  const maxAttempts = 5;

  if (!email) return next(); // nếu chưa nhập email thì bỏ qua

  const record = attempts.get(email);

  if (record) {
    // Nếu trong 1 phút
    if (now - record.lastAttempt < limitTime) {
      record.count += 1;
      record.lastAttempt = now;

      // 🚫 Nếu vượt quá giới hạn
      if (record.count > maxAttempts) {
        // 🧾 Ghi log vào MongoDB
        try {
          await Log.create({
            userId: null,
            action: "LOGIN_RATE_LIMIT",
            details: `Email ${email} bị chặn do đăng nhập sai quá nhiều`,
            ip: req.ip,
            timestamp: new Date(),
          });
        } catch (logErr) {
          console.warn("⚠️ Không thể ghi log:", logErr.message);
        }

        return res.status(429).json({
          message:
            "🚫 Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.",
        });
      }
    } else {
      // ✅ Reset lại sau khi quá 1 phút
      attempts.set(email, { count: 1, lastAttempt: now });
    }
  } else {
    // 🆕 Lần đầu tiên thử đăng nhập
    attempts.set(email, { count: 1, lastAttempt: now });
  }

  // 🧹 Tự động dọn map để tránh đầy bộ nhớ
  for (const [key, value] of attempts.entries()) {
    if (now - value.lastAttempt > 5 * 60 * 1000) {
      attempts.delete(key);
    }
  }

  next();
};
