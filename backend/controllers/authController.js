// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

// --- Cấu hình thời gian sống ---
const ACCESS_TOKEN_EXPIRE = "15m"; // Access Token hết hạn sau 15 phút
const REFRESH_TOKEN_EXPIRE_DAYS = 7; // Refresh Token sống 7 ngày

// --- Tạo Access Token ---
function createAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret123", {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });
}

// --- Tạo Refresh Token ---
function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "refresh456", {
    expiresIn: `${REFRESH_TOKEN_EXPIRE_DAYS}d`,
  });
}

// ✅ ĐĂNG KÝ
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    const { password: _, ...userWithoutPass } = newUser._doc;

    res.status(201).json({
      message: "Đăng ký thành công 🎉",
      user: userWithoutPass,
    });
  } catch (err) {
    console.error("❌ Lỗi signup:", err.message);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// ✅ ĐĂNG NHẬP — tạo Access + Refresh Token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    // 🪙 Tạo Access Token
    const accessToken = createAccessToken({ id: user._id, role: user.role });

    // 🔁 Tạo Refresh Token
    const refreshToken = createRefreshToken({ id: user._id });

    // 💾 Lưu Refresh Token vào DB
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
    });

    const { password: _, ...userSafe } = user._doc;

    res.status(200).json({
      message: "Đăng nhập thành công ✅",
      accessToken,
      refreshToken,
      user: userSafe,
    });
  } catch (err) {
    console.error("❌ Lỗi login:", err.message);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

// ✅ API Refresh Token
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Thiếu refresh token" });

    // Kiểm tra trong DB
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken)
      return res.status(403).json({ message: "Refresh token không hợp lệ" });

    // Xác minh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh456");
    } catch (err) {
      await RefreshToken.deleteOne({ token: refreshToken });
      return res.status(403).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });
    }

    // Tạo Access Token mới
    const user = await User.findById(decoded.id);
    if (!user) {
      await RefreshToken.deleteOne({ token: refreshToken });
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const newAccessToken = createAccessToken({ id: user._id, role: user.role });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("❌ Lỗi refresh token:", err.message);
    res.status(500).json({ message: "Lỗi server khi refresh token" });
  }
};

// ✅ ĐĂNG XUẤT — xóa Refresh Token khỏi DB
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken)
      await RefreshToken.deleteOne({ token: refreshToken });
    res.status(200).json({ message: "🚪 Đã đăng xuất và thu hồi token" });
  } catch (err) {
    console.error("❌ Lỗi logout:", err.message);
    res.status(500).json({ message: "Lỗi server khi logout" });
  }
};
