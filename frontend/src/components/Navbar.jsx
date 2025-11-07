// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất?")) return;
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (!isAuthenticated) return navigate("/");
    if (user?.role === "admin" || user?.role === "moderator") navigate("/");
    else navigate("/profile");
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
      {/* 🔷 Logo */}
      <h2
        style={{ margin: 0, cursor: "pointer", userSelect: "none" }}
        onClick={handleLogoClick}
      >
        🌐 Group 10
      </h2>

      <div>
        {!isAuthenticated ? (
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
            {/* 🧩 Menu cho Admin */}
            {user?.role === "admin" && (
              <>
                <button style={navBtn} onClick={() => navigate("/")}>
                  ⚙️ Quản lý User
                </button>
                <button
                  style={{ ...navBtn, background: "#6f42c1" }}
                  onClick={() => navigate("/logs")}
                >
                  📜 Xem Log
                </button>
              </>
            )}

            {/* 🧩 Menu cho Moderator */}
            {user?.role === "moderator" && (
              <button style={navBtn} onClick={() => navigate("/")}>
                👀 Xem danh sách
              </button>
            )}

            {/* 🧩 Hồ sơ & Logout */}
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
