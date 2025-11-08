// ✅ Nạp biến môi trường trước tiên
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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

// ✅ Cho phép Render nhận IP thật từ proxy (bắt buộc cho Render)
app.set("trust proxy", 1);

// ✅ Middleware cơ bản
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://group10-project-rose.vercel.app", // Frontend (Vercel)
      "http://localhost:3000", // Local test
    ],
    credentials: true,
  })
);

// ✅ Ghi log chi tiết ra console — giúp Render hiển thị đúng IP và hành động
app.use((req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || // IP thực từ proxy (Render)
    req.connection?.remoteAddress ||                 // Dự phòng cho Node < v18
    req.socket?.remoteAddress ||                     // Dự phòng nếu không có connection
    req.ip;                                          // Cuối cùng: fallback local (::1)

  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.headers["user-agent"] || "Unknown";

  console.log(`📡 ${method} ${url}\n   🌐 IP: ${ip}\n   🧠 User-Agent: ${userAgent}`);
  next();
});


// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Đăng ký routes (logActivity được sử dụng trong từng route cụ thể)
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api", adminRoutes);
app.use("/api", passwordRoutes);
app.use("/api", uploadRoutes);
app.use("/api", logRoutes);

// ✅ Route gốc — giúp giám khảo thấy backend “sống”
app.get("/", (req, res) => {
  res.send(`
    <h2 style="font-family:sans-serif; text-align:center; margin-top:50px;">
      🚀 Backend API đang hoạt động trên Render!<br><br>
      <small>Ví dụ: <code>/api/auth/login</code> hoặc <code>/api/users</code></small>
    </h2>
  `);
});

// ✅ Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} (Render hoặc Local)`)
);
