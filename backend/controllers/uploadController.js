// backend/controllers/uploadController.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/User");

// ✅ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Kiểm tra config
console.log("☁️ Cloudinary initialized:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "❌ Missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "❌ Missing",
});

// ✅ Tạo CloudinaryStorage cho Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars", // 📂 Tên folder trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 400, height: 400, crop: "fill" }], // resize tự động
  },
});

const upload = multer({ storage });

// ✅ API upload avatar (chính thức)
exports.uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      // 1️⃣ Kiểm tra file có được gửi từ client
      if (!req.file || !req.file.path) {
        console.error("❌ Không nhận được file từ client!");
        return res.status(400).json({ message: "Chưa chọn ảnh để upload" });
      }

      console.log("📤 Upload avatar cho user:", req.user?.id);
      console.log("🖼️ URL Cloudinary:", req.file.path);

      // 2️⃣ Cập nhật user trong MongoDB
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: req.file.path },
        { new: true }
      ).select("-password");

      if (!updatedUser)
        return res.status(404).json({ message: "Không tìm thấy user" });

      console.log("✅ Upload avatar thành công, đã cập nhật DB.");

      // 3️⃣ Gửi kết quả về frontend
      res.status(200).json({
        message: "✅ Upload thành công!",
        avatar_url: req.file.path,
        user: updatedUser,
      });
    } catch (error) {
      console.error("❌ Lỗi khi upload ảnh:", error.message);
      res
        .status(500)
        .json({ message: "❌ Upload thất bại", error: error.message });
    }
  },
];