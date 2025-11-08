// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const Log = require("../models/Log");

// --- Thời gian sống ---
const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "15m";
const REFRESH_TOKEN_EXPIRE_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRE_DAYS || "7", 10);

console.log("⚙️ Access token expire time:", ACCESS_TOKEN_EXPIRE);
console.log("⚙️ Refresh token expire days:", REFRESH_TOKEN_EXPIRE_DAYS);

// ✅ Helper: Lấy IP thật của client
function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip
  );
}

// ✅ Helper: Tạo Access Token
function createAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret123", {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });
}

// ✅ Helper: Tạo Refresh Token
function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "refresh456", {
    expiresIn: `${REFRESH_TOKEN_EXPIRE_DAYS}d`,
  });
}

// ✅ Đăng ký
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

    const ip = getClientIP(req);
    await Log.create({
      userId: newUser._id,
      action: "REGISTER",
      details: `Người dùng ${email} đăng ký tài khoản`,
      ip,
    });

    res.status(201).json({
      message: "Đăng ký thành công 🎉",
      user: userWithoutPass,
    });
  } catch (err) {
    console.error("❌ Lỗi signup:", err.message);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// ✅ Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    const ip = getClientIP(req); // ✅ lấy IP thật

    if (!isMatch) {
      await Log.create({
        userId: null,
        action: "LOGIN_FAIL",
        details: `Đăng nhập thất bại với email ${email}`,
        ip,
      });
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const accessToken = createAccessToken({ id: user._id, role: user.role });
    const refreshToken = createRefreshToken({ id: user._id });
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
    });

    const { password: _, ...userSafe } = user._doc;

    await Log.create({
      userId: user._id,
      action: "LOGIN_SUCCESS",
      details: `Người dùng ${user.email} đăng nhập thành công`,
      ip,
    });

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

// ✅ Lấy thông tin user từ Access Token
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    console.error("❌ Lỗi getMe:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin user" });
  }
};

// ✅ Refresh token
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Thiếu refresh token" });

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken)
      return res.status(403).json({ message: "Refresh token không hợp lệ" });

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh456"
      );
    } catch (err) {
      await RefreshToken.deleteOne({ token: refreshToken });
      return res
        .status(403)
        .json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });
    }

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

// ✅ Đăng xuất
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await RefreshToken.deleteOne({ token: refreshToken });

    const ip = getClientIP(req); // ✅ IP thật
    await Log.create({
      userId: req.user?.id || null,
      action: "LOGOUT",
      details: "Người dùng đăng xuất hệ thống",
      ip,
    });

    res.status(200).json({ message: "🚪 Đã đăng xuất và thu hồi token" });
  } catch (err) {
    console.error("❌ Lỗi logout:", err.message);
    res.status(500).json({ message: "Lỗi server khi logout" });
  }
};
