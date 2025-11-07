import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice"; // 🧩 Redux thunk
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  // 🕒 Đếm ngược khi bị khóa
  useEffect(() => {
    if (locked && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && locked) {
      setLocked(false);
      setMessage("");
    }
  }, [locked, countdown]);

  // 🧠 Gửi yêu cầu đăng nhập qua Redux Thunk
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) {
      setMessage(`🚫 Tài khoản bị tạm khóa. Vui lòng chờ ${countdown}s.`);
      return;
    }

    setMessage("");
    try {
      const result = await dispatch(loginUser(form));

      // 🟢 Nếu đăng nhập thành công
      if (result.meta.requestStatus === "fulfilled") {
        setMessage("✅ Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        const status = result.payload?.status || result.error?.status;
        const msg = result.payload?.message || "Đăng nhập thất bại.";

        // ⚠️ Nếu bị rate limit
        if (status === 429 || msg.includes("quá nhiều")) {
          setMessage("🚫 Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 60 giây.");
          setLocked(true);
          setCountdown(60);
        } else {
          setMessage("❌ Sai email hoặc mật khẩu!");
          setForm({ ...form, password: "" });
        }
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setMessage("❌ Đăng nhập thất bại, thử lại sau!");
    }
  };

  // Nếu đã login → chuyển về trang chủ
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

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

        {/* 🔑 Quên mật khẩu */}
        <p style={{ marginTop: "15px" }}>
          <a href="/forgot-password" style={{ color: "#007bff", textDecoration: "none" }}>
            🔑 Quên mật khẩu?
          </a>
        </p>

        {/* 🆕 Đăng ký */}
        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Chưa có tài khoản?{" "}
          <a href="/signup" style={{ color: "#007bff", textDecoration: "none", fontWeight: 500 }}>
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}

// 💅 Style giữ nguyên
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
