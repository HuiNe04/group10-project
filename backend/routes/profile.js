const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Xem thông tin cá nhân
router.get("/profile", authMiddleware, profileController.getProfile);

// Cập nhật thông tin cá nhân
router.put("/profile", authMiddleware, profileController.updateProfile);

module.exports = router;