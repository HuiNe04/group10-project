// ✅ Nạp biến môi trường trước tiên
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Import các routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");
const passwordRoutes = require("./routes/password");
const uploadRoutes = require("./routes/upload");
const logRoutes = require("./routes/logs");

// ✅ Import middleware (vẫn giữ import logActivity)
const { logActivity } = require("./middleware/logActivity");

const app = express();

// ✅ Cho phép Render lấy IP thật của người dùng
app.set("trust proxy", 1);

// ✅ Middleware cơ bản
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://group10-project-rose.vercel.app", // Frontend Vercel
      "http://localhost:3000", // Local dev
    ],
    credentials: true,
  })
);

// ✅ Log ra console khi có request (debug)
app.use((req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.ip;
  console.log(`📡 ${req.method} ${req.originalUrl} [IP: ${ip}]`);
  next();
});

// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Đăng ký các routes (logActivity được gắn riêng trong từng route)
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api", adminRoutes);
app.use("/api", passwordRoutes);
app.use("/api", uploadRoutes);
app.use("/api", logRoutes);

// ✅ Route gốc hiển thị thông báo (thay cho "Cannot GET /")
app.get("/", (req, res) => {
  res.send(`
    <h2 style="font-family:sans-serif; text-align:center; margin-top:50px;">
      🚀 Backend API đang hoạt động trên Render!<br><br>
      <small>Truy cập <code>/api/auth/login</code> hoặc <code>/api/users</code> để dùng API.</small>
    </h2>
  `);
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} (Render/Local)`)
);
