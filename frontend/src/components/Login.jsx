import React, { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(0); // ⏳ đếm ngược thời gian chờ
  const navigate = useNavigate();

  // 🕒 Tự động đếm ngược
  useEffect(() => {
    if (locked && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && locked) {
      setLocked(false);
      setMessage("");
    }
  }, [locked, countdown]);

  // 🧠 Gửi yêu cầu đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) {
      setMessage(`🚫 Tài khoản bị tạm khóa. Vui lòng chờ ${countdown}s.`);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("✅ Đăng nhập thành công!");
      if (onLoginSuccess) onLoginSuccess();
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      // ⚠️ Nếu bị rate limit
      if (status === 429) {
        setMessage("🚫 Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 60 giây.");
        setLocked(true);
        setCountdown(60);
      } else {
        // ❌ Sai mật khẩu → xóa trường password
        setMessage("❌ Sai email hoặc mật khẩu!");
        setForm({ ...form, password: "" });
      }
    } finally {
      setLoading(false);
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
            disabled={locked || loading}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
            required
            disabled={locked || loading}
          />

          <button
            type="submit"
            style={locked ? buttonLocked : buttonStyle}
            disabled={locked || loading}
          >
            {locked
              ? `⏳ Thử lại sau ${countdown}s`
              : loading
              ? "🔄 Đang đăng nhập..."
              : "Đăng nhập"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: message.startsWith("✅") ? "green" : "red",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}

        {/* 🔑 Forgot password */}
        <p style={{ marginTop: "15px" }}>
          <a
            href="/forgot-password"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            🔑 Quên mật khẩu?
          </a>
        </p>

        {/* 🆕 Sign up link */}
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

// 💅 Styles
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

const buttonLocked = {
  ...buttonStyle,
  backgroundColor: "#6c757d",
  cursor: "not-allowed",
};

export default Login;
