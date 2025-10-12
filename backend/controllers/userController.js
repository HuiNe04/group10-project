const User = require("../models/User");

//  GET: Lấy tất cả user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách users" });
  }
};

//  POST: Thêm user mới
exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Thiếu name hoặc email" });

  try {
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm user" });
  }
};

//  PUT: Cập nhật user theo id
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật user" });
  }
};

// 📍 DELETE: Xóa user theo id
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ message: "Đã xóa user thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa user" });
  }
};