// backend/routes/upload.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const uploadController = require("../controllers/uploadController");

// 🖼️ API upload avatar (có xác thực)
router.post("/upload-avatar", authMiddleware, uploadController.uploadAvatar);

module.exports = router;