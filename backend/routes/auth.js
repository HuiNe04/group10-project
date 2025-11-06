const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimitLogin"); // ✅ thêm dòng này

// Đăng ký
router.post("/signup", authController.signup);

// Đăng nhập (giới hạn tốc độ)
router.post("/login", loginLimiter, authController.login); // ✅ áp dụng limiter

// Refresh token
router.post("/refresh", authController.refresh);

// Đăng xuất
router.post("/logout", authController.logout);

module.exports = router;
