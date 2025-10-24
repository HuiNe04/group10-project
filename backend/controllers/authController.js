const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ ĐĂNG KÝ
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra dữ liệu hợp lệ
    if (!name || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

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

// ✅ ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu nhập
    if (!email || !password)
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    const { password: _, ...userSafe } = user._doc;

    res.status(200).json({
      message: "Đăng nhập thành công ✅",
      token,
      user: userSafe,
    });
  } catch (err) {
    console.error("❌ Lỗi login:", err.message);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

// ✅ ĐĂNG XUẤT
exports.logout = (req, res) => {
  res.status(200).json({ message: "Đã đăng xuất (token bị xóa phía client)" });
};
