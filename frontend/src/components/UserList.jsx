import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ reload }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const API_URL = "http://localhost:5000/api/users";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách user:", err.message);
      alert("Không thể tải danh sách người dùng (kiểm tra backend).");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err.message);
      alert("Không thể xóa user!");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, { name: editName, email: editEmail });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật user:", err.message);
      alert("Không thể cập nhật user!");
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        👥 Danh sách người dùng
      </h2>

      {users.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>Chưa có người dùng nào.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "15px",
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
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                  <p style={{ fontWeight: "bold", color: "#007bff" }}>{user.name}</p>
                  <p style={{ color: "#555" }}>{user.email}</p>
                  <div style={{ marginTop: "8px" }}>
                    <button onClick={() => handleEdit(user)} style={editBtn}>
                      ✏️ Sửa
                    </button>
                    <button onClick={() => handleDelete(user._id)} style={deleteBtn}>
                      🗑️ Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 🎨 Style nhỏ gọn
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
