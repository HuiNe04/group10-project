// routes/logs.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { logActivity } = require("../middleware/logActivity");
const logController = require("../controllers/logController");

// ✅ Admin xem tất cả logs
router.get(
  "/logs",
  authMiddleware,
  roleMiddleware("admin"),
  logActivity, // 📝 Ghi log hành động (GET /api/logs)
  logController.getAllLogs
);

// ✅ Xem log theo user (Admin hoặc chính user)
router.get(
  "/logs/:id",
  authMiddleware,
  logActivity, // 📝 Ghi log hành động (GET /api/logs/:id)
  logController.getUserLogs
);

module.exports = router;
