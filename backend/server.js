// ✅ NẠP BIẾN MÔI TRƯỜNG TRƯỚC NHẤT
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
const logRoutes = require("./routes/logs"); // 🆕 Bổ sung dòng này để xử lý API logs

// ✅ Import middleware
const { logActivity } = require("./middleware/logActivity");
const { loginLimiter } = require("./middleware/rateLimitLogin");

const app = express();

// ✅ Middleware cơ bản
app.use(express.json());
app.use(cors());
app.use(logActivity); // 🧠 Ghi log mọi request

// ✅ Log request console để dễ debug
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Sử dụng routes
app.use("/api", userRoutes);

// ⚡ Thêm giới hạn rate limit cho login
app.use("/api/auth/login", loginLimiter, authRoutes);
app.use("/api/auth", authRoutes);

app.use("/api", profileRoutes);
app.use("/api", adminRoutes);
app.use("/api", passwordRoutes);
app.use("/api", uploadRoutes);
app.use("/api", logRoutes); // 🧾 Route ghi log cho Admin

// ✅ Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
