// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { logActivity } = require("../middleware/logActivity");git
const checkRole = require("../middleware/roleMiddleware");

// ✅ GET all users — chỉ Admin hoặc Moderator được xem
router.get("/users", authMiddleware, checkRole("moderator"), userController.getUsers);

// ✅ POST new user — chỉ Admin được thêm
router.post("/users", authMiddleware, checkRole("admin"), userController.createUser);

// ✅ PUT update user — Admin hoặc chính chủ được chỉnh
router.put("/users/:id", authMiddleware, userController.updateUser);

// ✅ DELETE user — Admin hoặc chính chủ được xóa
router.delete("/users/:id", authMiddleware, userController.deleteUser);

module.exports = router;
