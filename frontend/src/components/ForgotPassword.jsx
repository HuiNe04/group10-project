import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      Swal.fire("⚠️ Lỗi", "Vui lòng nhập email!", "warning");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { email });
      Swal.fire("✅ Thành công", res.data.message, "success");
      console.log("Token reset (xem console backend):", res.data.token);
    } catch (err) {
      Swal.fire("❌ Lỗi", err.response?.data?.message || "Không thể gửi email", "error");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2>📧 Quên mật khẩu</h2>
        <p>Nhập email để lấy mã đặt lại mật khẩu</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email của bạn..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Gửi yêu cầu</button>
        </form>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
};

const formStyle = {
  background: "#fff",
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
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
