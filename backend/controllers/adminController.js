const User = require("../models/User");

// ✅ Lấy danh sách tất cả user (chỉ Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách user", error: err.message });
  }
};

// ✅ Xóa user theo ID (Admin hoặc chính chủ)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Nếu user không phải admin, chỉ được xóa chính mình
    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Không thể xóa tài khoản người khác" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ message: "Đã xóa tài khoản thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa user", error: err.message });
  }
};