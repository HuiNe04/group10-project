import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        alert("❌ Không thể tải thông tin người dùng!");
        console.error(err.message);
      }
    };
    fetchProfile();
  }, []);

  if (!user)
    return <p style={{ textAlign: "center" }}>⏳ Đang tải thông tin...</p>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#007bff" }}>
        👤 Thông tin cá nhân
      </h2>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <img
          src={user.avatar || "https://placehold.co/120x120?text=User&font=roboto"}
          alt="Avatar"
          onError={(e) => (e.target.src = "/fallback.png")}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "3px solid #007bff",
            objectFit: "cover",
          }}
        />
      </div>

      <p><b>👤 Họ tên:</b> {user.name}</p>
      <p><b>📧 Email:</b> {user.email}</p>
      <p><b>🔑 Vai trò:</b> {user.role}</p>

      <button onClick={() => navigate("/profile/edit")} style={buttonStyle}>
        ✏️ Chỉnh sửa thông tin
      </button>
    </div>
  );
}

const buttonStyle = {
  display: "block",
  margin: "20px auto 0",
  background: "linear-gradient(135deg, #007bff, #00b4d8)",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
};

export default ViewProfile;
