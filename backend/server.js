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
const logRoutes = require("./routes/logs");

// ✅ Import middleware
const { logActivity } = require("./middleware/logActivity");

const app = express();

// ✅ Middleware cơ bản
app.use(express.json());

// ✅ Cho phép frontend gọi API (Vercel + localhost)
app.use(
  cors({
    origin: [
      "https://group10-project-rose.vercel.app", // Frontend Vercel
      "http://localhost:3000", // Local dev
    ],
    credentials: true,
  })
);

// ✅ Ghi log request ra console
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Log hoạt động người dùng
app.use(logActivity);

// ✅ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Routes
app.use("/api/auth", authRoutes); // Auth
app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api", adminRoutes);
app.use("/api", passwordRoutes);
app.use("/api", uploadRoutes);
app.use("/api", logRoutes);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
