const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { logActivity } = require("../middleware/logActivity");
const uploadController = require("../controllers/uploadController");

// 🖼️ Upload avatar
router.post("/upload-avatar", authMiddleware, logActivity, uploadController.uploadAvatar);

module.exports = router;
