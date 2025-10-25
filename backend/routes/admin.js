// routes/admin.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
//const authMiddleware = require("../middleware/authMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ✅ Chỉ Admin mới xem danh sách user
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllUsers
);

// ✅ Admin hoặc chính chủ được xóa user
router.delete(
  "/users/:id",
  authMiddleware,
  adminController.deleteUser
);

module.exports = router;
