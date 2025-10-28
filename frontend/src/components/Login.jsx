import React, { useState } from "react";
import API from "../api/axiosInstance"; // 🆕 dùng axios instance có interceptor
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🟢 Gửi request đăng nhập
      const res = await API.post("/auth/login", form);

      // 🪙 Lưu Access Token + Refresh Token + Thông tin user
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("✅ Đăng nhập thành công!");
      if (onLoginSuccess) onLoginSuccess();
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err.response?.data || err.message);
      setMessage("❌ Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #7F7FD5, #86A8E7, #91EAE4)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>🔐 Đăng nhập</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>
            Đăng nhập
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

        {/* 🔑 Thêm liên kết Forgot password */}
        <p style={{ marginTop: "15px" }}>
          <a
            href="/forgot-password"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            🔑 Quên mật khẩu?
          </a>
        </p>

        {/* 🆕 Liên kết đăng ký */}
        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Chưa có tài khoản?{" "}
          <a
            href="/signup"
            style={{ color: "#007bff", textDecoration: "none", fontWeight: 500 }}
          >
            Đăng ký ngay
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
  backgroundColor: "#007bff",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "15px",
  cursor: "pointer",
  marginTop: "10px",
  transition: "0.3s",
};

export default Login;
