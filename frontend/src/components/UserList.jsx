import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Load users
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xóa user
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

  // Bắt đầu sửa user
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  // Cập nhật user
  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/users/${id}`, {
      name: editName,
      email: editEmail,
    });
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      {users.map((user) => (
        <div key={user._id}>
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
            </>
          ) : (
            <>
              <span>{user.name} - {user.email}</span>
              <button onClick={() => handleEdit(user)}>Sửa</button>
              <button onClick={() => handleDelete(user._id)}>Xóa</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserList;
