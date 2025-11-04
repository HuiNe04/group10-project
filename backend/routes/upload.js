const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/upload-avatar", authMiddleware, uploadController.uploadAvatar);

module.exports = router;