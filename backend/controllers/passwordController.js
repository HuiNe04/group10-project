const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const transporter = require("../config/nodemailer");

// ✅ API: Gửi email reset password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });

    // 🔑 Sinh token ngẫu nhiên 32 bytes
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpire = Date.now() + 15 * 60 * 1000; // hết hạn sau 15 phút

    // Lưu tạm token vào DB
    user.resetToken = resetToken;
    user.resetTokenExpire = tokenExpire;
    await user.save();

    // 🔗 Tạo link reset
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // 📧 Gửi email thật qua Gmail SMTP
    await transporter.sendMail({
      from: `"Group 10 App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Đặt lại mật khẩu của bạn",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h3>Xin chào ${user.name || "bạn"},</h3>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
          <p>Nhấn vào nút dưới đây để đặt lại mật khẩu:</p>
          <a href="${resetLink}" target="_blank"
            style="background:#007bff;color:#fff;padding:10px 15px;
            text-decoration:none;border-radius:6px;display:inline-block">
            🔐 Đặt lại mật khẩu
          </a>
          <p style="margin-top:15px">Hoặc copy đường dẫn này nếu nút không hoạt động:</p>
          <p>${resetLink}</p>
          <p><b>Lưu ý:</b> Link này sẽ hết hạn sau 15 phút.</p>
        </div>
      `,
    });

    console.log("📧 Email reset gửi thành công tới:", email);
    res.json({ message: "✅ Đã gửi email đặt lại mật khẩu! Kiểm tra hộp thư của bạn." });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    res.status(500).json({ message: "Không thể gửi email reset mật khẩu", error: error.message });
  }
};

// ✅ API: Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }, // token còn hạn
    });

    if (!user)
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    // 🔒 Mã hóa mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "✅ Mật khẩu đã được đặt lại thành công!" });
  } catch (error) {
console.error("❌ Lỗi reset mật khẩu:", error);
    res.status(500).json({ message: "Không thể đặt lại mật khẩu", error: error.message });
  }
};