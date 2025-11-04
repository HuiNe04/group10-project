const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 📋 GET: Lấy tất cả user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Ẩn password khi trả về
    res.json(users);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách users:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách users" });
  }
};

// ➕ POST: Thêm user mới
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!name || !email)
      return res.status(400).json({ message: "Thiếu name hoặc email" });

    // Kiểm tra trùng email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    // Mã hóa password (nếu có)
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      message: "✅ Thêm user thành công!",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi thêm user:", error);
    res.status(500).json({ message: "Lỗi khi thêm user", error: error.message });
  }
};

// ✏️ PUT: Cập nhật user theo id
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật user" });
  }
};

// controllers/userController.js (chỉ phần deleteUser thay thế)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // req.user được authMiddleware gắn (chứa id và role)
    const requester = req.user; // { id, role, ... }

    // Nếu requester không phải admin và không phải chính chủ thì không cho xóa
    if (requester.role !== "admin" && requester.id !== id) {
      return res.status(403).json({ message: "Không có quyền xóa user này" });
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
