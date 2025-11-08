// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { logActivity } = require("../middleware/logActivity");
const checkRole = require("../middleware/roleMiddleware");

// ✅ GET all users — chỉ Admin hoặc Moderator được xem
router.get(
  "/users",
  authMiddleware,
  checkRole("moderator"), // 🧩 Cho phép admin và moderator
  logActivity,            // 📝 Ghi log hành động xem danh sách user
  userController.getUsers
);

// ✅ POST new user — chỉ Admin được thêm
router.post(
  "/users",
  authMiddleware,
  checkRole("admin"),
  logActivity,            // 📝 Ghi log hành động thêm user
  userController.createUser
);

// ✅ PUT update user — Admin hoặc chính chủ được chỉnh
router.put(
  "/users/:id",
  authMiddleware,
  logActivity,            // 📝 Ghi log hành động chỉnh sửa user
  userController.updateUser
);

// ✅ DELETE user — Admin hoặc chính chủ được xóa
router.delete(
  "/users/:id",
  authMiddleware,
  logActivity,            // 📝 Ghi log hành động xóa user
  userController.deleteUser
);

module.exports = router;
