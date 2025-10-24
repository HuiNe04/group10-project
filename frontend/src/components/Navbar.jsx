import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      onLogout();
      navigate("/login");
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
      <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
        🌐 Group 10
      </h2>
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
          <button style={{ ...navBtn, background: "#dc3545" }} onClick={handleLogout}>
            Đăng xuất
          </button>
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
