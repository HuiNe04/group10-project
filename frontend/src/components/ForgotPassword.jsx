import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      Swal.fire("⚠️ Lỗi", "Vui lòng nhập email!", "warning");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { email });

      console.log("👉 Token reset (xem console backend):", res.data.token);

      Swal.fire({
        icon: "success",
        title: "✅ Đã gửi email!",
        text: "Vui lòng kiểm tra hộp thư đến hoặc thư rác để nhận liên kết đặt lại mật khẩu.",
        showConfirmButton: false,
        timer: 2500,
      });

      // ⏳ Tự động quay về trang đăng nhập sau 2.5 giây
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      Swal.fire("❌ Lỗi", err.response?.data?.message || "Không thể gửi email reset mật khẩu", "error");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2>📧 Quên mật khẩu</h2>
        <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email của bạn..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Gửi email đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}

// 💅 Style
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #8ec5fc, #e0c3fc)",
};

const formStyle = {
  background: "#fff",
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  width: "400px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "15px",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  background: "#007bff",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default ForgotPassword;
