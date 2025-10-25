import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim() || !newPassword.trim()) {
      Swal.fire("⚠️ Lỗi", "Vui lòng nhập đủ token và mật khẩu!", "warning");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        token,
        newPassword,
      });
      Swal.fire("✅ Thành công", res.data.message, "success");
    } catch (err) {
      Swal.fire("❌ Lỗi", err.response?.data?.message || "Không thể đặt lại mật khẩu", "error");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2>🔑 Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nhập token từ email (console backend)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Đặt lại mật khẩu</button>
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
  background: "linear-gradient(135deg, #f6d365, #fda085)",
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
  background: "#28a745",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default ResetPassword;
