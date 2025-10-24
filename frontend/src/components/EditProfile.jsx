import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [form, setForm] = useState({ name: "", password: "", avatar: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          name: res.data.name,
          avatar: res.data.avatar || "",
          password: "",
        });
      } catch (err) {
        Swal.fire("❌ Lỗi", "Không thể tải thông tin người dùng", "error");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/profile",
        {
          name: form.name,
          password: form.password || undefined,
          avatar: form.avatar,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("✅ Thành công", "Cập nhật hồ sơ thành công", "success");
      navigate("/profile");
    } catch (err) {
      Swal.fire("❌ Lỗi", "Không thể cập nhật hồ sơ", "error");
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

        <input
          type="text"
          placeholder="Link ảnh đại diện"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          style={inputStyle}
        />

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

const inputStyle = {
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  outline: "none",
};

const saveBtn = {
  background: "#28a745",
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
