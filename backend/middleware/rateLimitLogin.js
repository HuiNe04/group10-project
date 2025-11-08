const Log = require("../models/Log");

// 🧠 Bộ nhớ tạm để theo dõi thất bại theo email
const attempts = new Map(); // key: email, value: { count, lastAttempt, lockedUntil }

exports.loginLimiter = async (req, res, next) => {
  const email = req.body.email;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 phút
  const maxAttempts = 5;

  if (!email) return next();

  const record = attempts.get(email);

  if (record) {
    // 🔒 Nếu đang bị khóa
    if (record.lockedUntil && now < record.lockedUntil) {
      const remain = Math.ceil((record.lockedUntil - now) / 1000);
      return res.status(429).json({
        message: `🚫 Tài khoản bị tạm khóa, vui lòng thử lại sau ${remain}s.`,
      });
    }

    // ⚙️ Trong khoảng 1 phút kể từ lần cuối
    if (now - record.lastAttempt < windowMs) {
      record.count += 1;
      record.lastAttempt = now;

      if (record.count > maxAttempts) {
        // 🧾 Ghi log
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

        record.lockedUntil = now + windowMs;
        attempts.set(email, record);

        console.warn(`🚫 ${email} bị khóa 1 phút do sai quá nhiều.`);
        return res.status(429).json({
          message: "🚫 Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.",
        });
      }
    } else {
      // ✅ Reset sau khi qua 1 phút không thử
      attempts.set(email, { count: 1, lastAttempt: now, lockedUntil: null });
    }
  } else {
    // 🆕 Lần đầu thử
    attempts.set(email, { count: 1, lastAttempt: now, lockedUntil: null });
  }

  // 🧹 Dọn Map sau 5 phút để tránh đầy bộ nhớ
  for (const [key, value] of attempts.entries()) {
    if (now - value.lastAttempt > 5 * 60 * 1000) {
      attempts.delete(key);
    }
  }

  next();
};
