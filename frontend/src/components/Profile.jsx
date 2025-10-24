import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", password: "", avatar: "" });
  const token = localStorage.getItem("token");

  // Lấy thông tin người dùng
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm({
        name: res.data.name,
        avatar: res.data.avatar || "",
        password: "",
      });
    } catch (err) {
      Swal.fire("❌ Lỗi", "Không thể tải thông tin người dùng", "error");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Cập nhật hồ sơ
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("✅ Thành công", "Cập nhật hồ sơ thành công", "success");
      fetchProfile();
    } catch (err) {
      Swal.fire("❌ Lỗi", "Không thể cập nhật hồ sơ", "error");
    }
  };

  if (!user)
    return <p style={{ textAlign: "center" }}>⏳ Đang tải thông tin...</p>;

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
        👤 Thông tin cá nhân
      </h2>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <img
          src={user.avatar || "https://via.placeholder.com/100"}
          alt="Avatar"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #007bff",
          }}
        />
      </div>

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

        <button type="submit" style={buttonStyle}>
          💾 Cập nhật hồ sơ
        </button>
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

const buttonStyle = {
  background: "linear-gradient(135deg, #007bff, #00b4d8)",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
};

export default Profile;
