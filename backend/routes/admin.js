const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { logActivity } = require("../middleware/logActivity");
const roleMiddleware = require("../middleware/roleMiddleware");

// ✅ Chỉ Admin mới xem danh sách user
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  logActivity,
  adminController.getAllUsers
);

// ✅ Admin hoặc chính chủ được xóa user
router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  logActivity,
  adminController.deleteUser
);

module.exports = router;
