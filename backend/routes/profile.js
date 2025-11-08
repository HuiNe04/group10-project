const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { logActivity } = require("../middleware/logActivity");

// 👤 Xem thông tin cá nhân
router.get("/profile", authMiddleware, logActivity, profileController.getProfile);

// ✏️ Cập nhật thông tin cá nhân
router.put("/profile", authMiddleware, logActivity, profileController.updateProfile);

module.exports = router;
