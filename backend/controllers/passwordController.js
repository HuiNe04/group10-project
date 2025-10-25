const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Lưu token reset tạm thời trong DB
let resetTokens = {};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const token = crypto.randomBytes(20).toString("hex");
    resetTokens[token] = user._id;

    // 🚀 Giả lập gửi email (console)
    console.log(`👉 Token reset cho ${email}: ${token}`);

    res.json({
      message: "✅ Đã gửi token reset vào email (xem console)",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const userId = resetTokens[token];
    if (!userId) return res.status(400).json({ message: "Token không hợp lệ hoặc hết hạn" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashed });
    delete resetTokens[token];

    res.json({ message: "✅ Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi reset mật khẩu", error: error.message });
  }
};