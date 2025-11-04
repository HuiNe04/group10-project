const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 📋 GET: Lấy tất cả user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách users:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách users" });
  }
};

// ➕ POST: Thêm user mới (chỉ admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Thiếu name hoặc email" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password || "123456", 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({
      message: "✅ Thêm user thành công!",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi thêm user:", error);
    res.status(500).json({ message: "Lỗi khi thêm user", error: error.message });
  }
};

// ✏️ PUT: Cập nhật user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const requester = req.user;

  try {
    // ✅ Chỉ admin hoặc chính chủ mới được chỉnh
    if (requester.role !== "admin" && requester.id !== id) {
      return res.status(403).json({ message: "⛔ Không có quyền chỉnh sửa user này" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({
      message: "💾 Cập nhật thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật user" });
  }
};

// 🗑️ DELETE: Xóa user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const requester = req.user;

  try {
    // ✅ Chỉ admin hoặc chính chủ mới được xóa
    if (requester.role !== "admin" && requester.id !== id) {
      return res.status(403).json({ message: "⛔ Không có quyền xóa user này" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ message: "🗑️ Đã xóa user thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa user:", error);
    res.status(500).json({ message: "Lỗi khi xóa user" });
  }
};
