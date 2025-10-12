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
  }, [reload]); // reload mỗi khi prop đổi

  const handleDelete = async (id) => {
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
      await axios.put(`${API_URL}/${id}`, {
        name: editName,
        email: editEmail,
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật user:", err.message);
      alert("Không thể cập nhật user!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        users.map((user) => (
          <div key={user._id} style={{ marginBottom: "10px" }}>
            {editingUser === user._id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
                <button onClick={() => handleUpdate(user._id)}>Lưu</button>
                <button onClick={() => setEditingUser(null)}>Hủy</button>
              </>
            ) : (
              <>
                <span>
                  {user.name} - {user.email}
                </span>{" "}
                <button onClick={() => handleEdit(user)}>Sửa</button>
                <button onClick={() => handleDelete(user._id)}>Xóa</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;