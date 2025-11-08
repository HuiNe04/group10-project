import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import Swal from "sweetalert2";

function EditProfile() {
  const [form, setForm] = useState({ name: "", password: "", avatar: "" });
  const [preview, setPreview] = useState(""); // 🆕 Preview ảnh chọn mới
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Lấy thông tin user hiện tại
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setForm({
          name: res.data.name,
          password: "",
          avatar: res.data.avatar || "",
        });
        setPreview(res.data.avatar || "");
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin user:", err.message);
        Swal.fire("❌ Lỗi", "Không thể tải thông tin người dùng!", "error");
      }
    };
    fetchProfile();
  }, []);

  // 🖼️ Hiển thị preview khi chọn ảnh
  const handlePreview = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // 🧠 Hiển thị ảnh tạm
  };

  // 📤 Upload ảnh lên Cloudinary qua backend
  const handleAvatarUpload = async () => {
    if (!file) {
      Swal.fire("⚠️ Vui lòng chọn ảnh trước!", "", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const res = await API.post("/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ ...form, avatar: res.data.avatar_url });
      setPreview(res.data.avatar_url);
      Swal.fire("✅ Thành công", "Upload ảnh đại diện thành công!", "success");
    } catch (err) {
      console.error("❌ Lỗi upload:", err.message);
      Swal.fire("❌ Lỗi", "Không thể upload ảnh đại diện!", "error");
    } finally {
      setUploading(false);
    }
  };

  // 💾 Cập nhật thông tin user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/profile", {
        name: form.name,
        password: form.password || undefined,
        avatar: form.avatar,
      });
      Swal.fire("✅ Thành công", "Cập nhật hồ sơ thành công!", "success");
      navigate("/profile");
    } catch (err) {
      console.error("❌ Lỗi cập nhật hồ sơ:", err.message);
      Swal.fire("❌ Lỗi", "Không thể cập nhật hồ sơ!", "error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#007bff" }}>
        ✏️ Cập nhật hồ sơ
      </h2>

      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Họ và tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Mật khẩu mới (nếu muốn đổi)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle}
        />

        {/* 🖼️ Hiển thị ảnh hiện tại hoặc preview ảnh mới */}
        <div style={{ textAlign: "center" }}>
          <img
            src={
              preview
                ? preview
                : form.avatar || "https://placehold.co/120x120?text=Avatar"
            }
            alt="avatar"
            onError={(e) => {
              e.target.src = "/fallback.png";
            }}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #007bff",
              marginBottom: "10px",
              transition: "0.3s",
            }}
          />
        </div>

        {/* 🔼 Upload file ảnh */}
        <input type="file" accept="image/*" onChange={handlePreview} />

        <button
          type="button"
          onClick={handleAvatarUpload}
          style={{
            ...uploadBtn,
            background: uploading ? "#ccc" : "#28a745",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
          disabled={uploading}
        >
          {uploading ? "⏳ Đang upload..." : "📤 Upload ảnh đại diện"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" style={saveBtn}>
            💾 Lưu thay đổi
          </button>
          <button
            type="button"
            style={cancelBtn}
            onClick={() => navigate("/profile")}
          >
            ⬅️ Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}

// 💅 Style
const inputStyle = {
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  outline: "none",
};

const uploadBtn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontWeight: "500",
  transition: "0.3s",
};

const saveBtn = {
  background: "#007bff",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
};

const cancelBtn = {
  background: "#6c757d",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
};

export default EditProfile;
