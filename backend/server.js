const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});


// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Routes
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))