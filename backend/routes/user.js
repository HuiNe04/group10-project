// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// GET all users - chỉ Admin
router.get("/users", authMiddleware, roleMiddleware("admin"), userController.getUsers);

// POST new user - giữ nguyên (có thể để admin tạo thêm)
router.post("/users", authMiddleware, roleMiddleware("admin"), userController.createUser);

// PUT update user - admin có thể chỉnh hoặc user tự chỉnh (nếu muốn)
router.put("/users/:id", authMiddleware, roleMiddleware("admin"), userController.updateUser);

// DELETE remove user - admin xóa bất kỳ, user có thể xóa chính mình
router.delete("/users/:id", authMiddleware, userController.deleteUser);

module.exports = router;

