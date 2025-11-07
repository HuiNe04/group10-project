const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimitLogin");

// 🧠 Đăng ký
router.post("/signup", authController.signup);

// 🔐 Đăng nhập (giới hạn tốc độ)
router.post("/login", loginLimiter, authController.login);

// 👤 Lấy thông tin user từ Access Token (Redux)
router.get("/me", authMiddleware, authController.getMe);

// 🔁 Refresh token
router.post("/refresh", authController.refresh);

// 🚪 Logout
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
