import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => setUsers(res.data));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/users/${id}`);
    setUsers(users.filter((u) => u._id !== id));
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setForm({ name: user.name, email: user.email });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3000/users/${editingUser}`, form);
    setEditingUser(null);
    const res = await axios.get("http://localhost:3000/users");
    setUsers(res.data);
  };

  return (
    <div>
      <h3>📋 Danh sách Users</h3>
      {users.map((user) => (
        <div key={user._id}>
          {editingUser === user._id ? (
            <form onSubmit={handleUpdate}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <button type="submit">Lưu</button>
            </form>
          ) : (
            <>
              <span>{user.name} ({user.email}) </span>
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
