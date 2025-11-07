import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ reload, readonly = false }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const API_URL = "http://localhost:5000/api/users";
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // 🔹 Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách user:", err.message);
      alert("Không thể tải danh sách người dùng (kiểm tra quyền Admin/Moderator).");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  // 🔹 Xóa user
  const handleDelete = async (id) => {
    if (readonly) return;
    if (!window.confirm("🗑️ Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Đã xóa user thành công!");
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err.message);
      alert("Không thể xóa user!");
    }
  };

  // 🔹 Sửa user (hiển thị form)
  const handleEdit = (user) => {
    if (readonly) return;
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  // 🔹 Lưu thay đổi
  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `${API_URL}/${id}`,
        { name: editName, email: editEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("💾 Cập nhật thành công!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật user:", err.message);
      alert("Không thể cập nhật user!");
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
              {editingUser === user._id ? (
                <>
                  <input
                    style={inputEdit}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    style={inputEdit}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(user._id)} style={saveBtn}>
                    💾 Lưu
                  </button>
                  <button onClick={() => setEditingUser(null)} style={cancelBtn}>
                    ❌ Hủy
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={user.avatar || "https://placehold.co/80x80?text=Avatar"}
                    alt="avatar"
                    onError={(e) => { e.target.src = "/fallback.png"; }}
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "10px",
                      border: "2px solid #007bff",
                    }}
                  />
                  <p style={{ fontWeight: "bold", color: "#007bff", margin: "0" }}>{user.name}</p>
                  <p style={{ color: "#555", margin: "5px 0 10px" }}>{user.email}</p>
                  <p style={{ fontSize: "13px", color: "#888" }}>Role: {user.role}</p>

                  {/* ADMIN hoặc chính user */}
                  {!readonly &&
                    (currentUser?.role === "admin" || currentUser?._id === user._id) && (
                      <>
                        <button onClick={() => handleEdit(user)} style={editBtn}>
                          ✏️ Sửa
                        </button>
                        <button onClick={() => handleDelete(user._id)} style={deleteBtn}>
                          🗑️ Xóa
                        </button>
                      </>
                    )}

                  {/* MODERATOR chỉ xem */}
                  {readonly && (
                    <p style={{ fontSize: "12px", color: "#aaa", marginTop: "5px" }}>
                      👀 Chế độ chỉ xem (Moderator)
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 💅 Style
const inputEdit = {
  width: "100%",
  padding: "8px",
  marginBottom: "6px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  outline: "none",
};

const editBtn = {
  background: "#ffc107",
  border: "none",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc3545",
  border: "none",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const saveBtn = {
  background: "#28a745",
  border: "none",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#6c757d",
  border: "none",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default UserList;
