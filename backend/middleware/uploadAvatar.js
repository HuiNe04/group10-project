// backend/middleware/uploadAvatar.js
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// 📁 Tạo thư mục tạm lưu ảnh (nếu chưa có)
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
    cb(null, true);
  },
});

// ✅ Resize ảnh bằng Sharp trước khi upload lên Cloudinary
const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `avatar-${Date.now()}.jpg`;
  const filePath = path.join(uploadDir, filename);

  await sharp(req.file.buffer)
    .resize(300, 300)
    .jpeg({ quality: 80 })
    .toFile(filePath);

  req.resizedImagePath = filePath;
  next();
};

module.exports = { upload, resizeImage };