// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất?")) return;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await API.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.warn("⚠️ Lỗi khi gọi API logout:", err.message);
    } finally {
      // 🧹 Xóa token, user info và điều hướng về trang login
      localStorage.clear();
      if (onLogout) onLogout();
      navigate("/login");
    }
  };

  // 🔁 Xác định trang chủ tùy role
  const handleLogoClick = () => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    if (user?.role === "admin" || user?.role === "moderator") {
      navigate("/");
    } else {
      navigate("/profile");
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#007bff",
        color: "white",
        padding: "12px 24px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* 🔷 Logo / Tiêu đề */}
      <h2
        style={{ margin: 0, cursor: "pointer", userSelect: "none" }}
        onClick={handleLogoClick}
      >
        🌐 Group 10
      </h2>

      {/* 🔹 Menu bên phải */}
      <div>
        {!isLoggedIn ? (
          <>
            <button style={navBtn} onClick={() => navigate("/signup")}>
              Đăng ký
            </button>
            <button style={navBtn} onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          </>
        ) : (
          <>
            {/* 🔹 Nút riêng cho từng role */}
            {user?.role === "admin" && (
              <button style={navBtn} onClick={() => navigate("/")}>
                ⚙️ Quản lý User
              </button>
            )}
            {user?.role === "moderator" && (
              <button style={navBtn} onClick={() => navigate("/")}>
                👀 Xem danh sách
              </button>
            )}
            {/* Người dùng bình thường vẫn có thể vào profile */}
            <button
              style={{ ...navBtn, background: "#17a2b8" }}
              onClick={() => navigate("/profile")}
            >
              👤 Hồ sơ
            </button>
            <button
              style={{ ...navBtn, background: "#dc3545" }}
              onClick={handleLogout}
            >
              🚪 Đăng xuất
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

// 💅 Style
const navBtn = {
  background: "#0056b3",
  border: "none",
  color: "white",
  padding: "8px 14px",
  marginLeft: "8px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 500,
  transition: "0.3s",
};

export default Navbar;
