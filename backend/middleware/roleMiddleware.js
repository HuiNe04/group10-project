// middleware/roleMiddleware.js
// ✅ Middleware phân quyền nâng cao (Admin > Moderator > User)

const rolePriority = { user: 1, moderator: 2, admin: 3 };

module.exports = function (requiredRole) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "⚠️ Chưa đăng nhập" });
    }

    const userRole = req.user.role || "user";
    const requiredLevel = rolePriority[requiredRole];
    const userLevel = rolePriority[userRole];

    // Nếu role hiện tại >= role yêu cầu thì cho qua
    if (userLevel >= requiredLevel) {
      return next();
    }

    return res
      .status(403)
      .json({ message: `⛔ Quyền hạn không đủ (${requiredRole} required)` });
  };
};
