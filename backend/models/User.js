const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"], // ✅ thêm moderator (cho Hoạt động 2)
      default: "user",
    },
    avatar: { type: String, default: "" },

    // 🔐 Thêm 2 trường để phục vụ reset password (Hoạt động 4)
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);