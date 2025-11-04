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

const app = express();

// ✅ Middleware cơ bản
app.use(express.json());
app.use(cors());

// ✅ Log request cho dễ debug
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
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", adminRoutes);
app.use("/api", passwordRoutes);
app.use("/api", uploadRoutes);

// ✅ Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));