import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 🧭 Lấy token từ URL khi user bấm link trong email
  useEffect(() => {
    const urlToken = new URLSearchParams(location.search).get("token");
    if (urlToken) setToken(urlToken);
  }, [location]);

  // 🚫 Nếu không có token trong URL, báo lỗi
  if (!token) {
    return (
      <div style={containerStyle}>
        <div style={formStyle}>
          <h2>🚫 Liên kết không hợp lệ</h2>
          <p>Vui lòng sử dụng liên kết trong email để đặt lại mật khẩu.</p>
        </div>
      </div>
    );
  }

  // 🧩 Gửi yêu cầu đặt lại mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      Swal.fire("⚠️ Lỗi", "Vui lòng nhập mật khẩu mới!", "warning");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        token,
        newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "✅ Thành công",
        text: res.data.message + " Bạn sẽ được chuyển đến trang đăng nhập.",
        showConfirmButton: false,
        timer: 1800,
      });

      setTimeout(() => navigate("/login"), 1800);
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
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Cập nhật mật khẩu
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
  background: "linear-gradient(135deg, #f6d365, #fda085)",
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
  margin: "10px 0",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
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

export default ResetPassword;
