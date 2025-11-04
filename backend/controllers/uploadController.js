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

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars", // 📂 Ảnh nằm trong thư mục này
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 400, height: 400, crop: "fill" }], // resize gọn
  },
});

const upload = multer({ storage });

// ✅ API upload avatar
exports.uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        console.error("❌ Không nhận được file từ client!");
        return res.status(400).json({ message: "Chưa chọn ảnh để upload" });
      }

      console.log("📤 Đang upload avatar cho user:", req.user?.id);
      console.log("🖼️ Ảnh Cloudinary URL:", req.file.path);

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: req.file.path },
        { new: true }
      ).select("-password");

      console.log("✅ Upload thành công! Cập nhật avatar trong DB.");

      res.json({
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