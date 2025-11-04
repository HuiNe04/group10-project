import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    if (!name.trim() || !email.trim()) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("⚠️ Email không hợp lệ!");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/users", {
        name,
        email,
        password: password || "123456", // nếu không nhập sẽ tự tạo
      });
      alert("✅ Thêm user thành công!");
      setForm({ name: "", email: "", password: "" });
      onUserAdded();
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err.message);
      alert("Không thể thêm user! Kiểm tra backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        margin: "20px auto",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        maxWidth: "700px",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "20px", color: "#333" }}>➕ Thêm người dùng mới</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}
      >
        <input
          type="text"
          placeholder="Họ và tên..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email..."
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Mật khẩu (tùy chọn)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "⏳ Đang thêm..." : "➕ Thêm người dùng"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  flex: 1,
  minWidth: "200px",
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
};

const buttonStyle = {
  background: "linear-gradient(135deg, #007bff, #00b4d8)",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.3s",
  fontWeight: "500",
};

export default AddUser;
