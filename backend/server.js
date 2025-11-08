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

// ✅ Import middleware (giữ nguyên import logActivity)
const { logActivity } = require("./middleware/logActivity");

const app = express();

// ✅ Middleware cơ bản
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://group10-project-rose.vercel.app", // Frontend trên Vercel
      "http://localhost:3000", // Local development
    ],
    credentials: true,
  })
);

// ✅ Log request ra console (chỉ để debug, không lưu MongoDB)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Đăng ký các route (logActivity sẽ được dùng bên trong từng route)
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api", adminRoutes);
app.use("/api", passwordRoutes);
app.use("/api", uploadRoutes);
app.use("/api", logRoutes);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
