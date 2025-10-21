import React from "react";

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav style={{ background: "#f4f4f4", padding: "10px" }}>
      <a href="/signup" style={{ marginRight: "10px" }}>Đăng ký</a>
      <a href="/login" style={{ marginRight: "10px" }}>Đăng nhập</a>
      {isLoggedIn && <button onClick={onLogout}>Đăng xuất</button>}
    </nav>
  );
}

export default Navbar;