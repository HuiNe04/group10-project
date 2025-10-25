import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ reload }) {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const API_URL = "http://localhost:5000/api/users";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách user:", err.message);
      alert("Không thể tải danh sách người dùng (kiểm tra quyền Admin).");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert("✅ Đã xóa user thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err.message);
      alert("Không thể xóa user!");
    }
  };

  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <h2 style={{ color: "#007bff", marginBottom: "20px" }}>👥 Danh sách người dùng</h2>

      {users.length === 0 ? (
        <p style={{ color: "#888" }}>Chưa có người dùng nào.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            padding: "10px 30px",
          }}
        >
          {users.map((user) => (
            <div
              key={user._id}
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={user.avatar || "https://via.placeholder.com/80"}
                alt="Avatar"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
              <p style={{ fontWeight: "bold", color: "#007bff" }}>{user.name}</p>
              <p style={{ color: "#555" }}>{user.email}</p>
              <p style={{ color: "#888", fontSize: "13px" }}>
                Role: <b>{user.role}</b>
              </p>

              {(currentUser?.role === "admin" || currentUser?._id === user._id) && (
                <button
                  onClick={() => handleDelete(user._id)}
                  style={{
                    background: "#dc3545",
                    border: "none",
                    color: "#fff",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  🗑️ Xóa
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;
