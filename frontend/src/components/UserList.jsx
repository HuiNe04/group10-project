import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const API_URL = "http://localhost:5000/api/users";

  // --- Load danh sách user ---
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
  }, []);

  // --- Thêm user ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      alert("Vui lòng nhập đầy đủ tên và email!");
      return;
    }

    try {
      await axios.post(API_URL, { name: newName, email: newEmail });
      setNewName("");
      setNewEmail("");
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err.message);
      alert("Không thể thêm user! (Kiểm tra backend hoặc dữ liệu nhập)");
    }
  };

  // --- Xóa user ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err.message);
      alert("Không thể xóa user!");
    }
  };

  // --- Bắt đầu sửa user ---
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  // --- Cập nhật user ---
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

      {/* Form thêm user */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tên..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email..."
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button type="submit">Thêm người dùng</button>
      </form>

      {/* Danh sách */}
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