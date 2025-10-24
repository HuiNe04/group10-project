const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin", error: error.message });
  }
};