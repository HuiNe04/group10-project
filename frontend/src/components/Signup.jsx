import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      setMessage("✅ Đăng ký thành công! Đang chuyển sang đăng nhập...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Lỗi khi đăng ký!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #a8edea, #fed6e3)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          width: "380px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>📝 Đăng ký tài khoản</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Họ và tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Đăng ký
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: message.includes("✅") ? "green" : "red",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Đã có tài khoản?{" "}
          <a href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  margin: "10px 0",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#28a745",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "15px",
  cursor: "pointer",
  marginTop: "10px",
  transition: "0.3s",
};

export default Signup;
