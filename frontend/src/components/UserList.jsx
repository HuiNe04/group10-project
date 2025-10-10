import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>📋 Danh sách người dùng (MongoDB)</h3>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((u) => (
            <li
              key={u._id}
              style={{
                background: "#f0f0f0",
                margin: "6px auto",
                padding: "8px",
                borderRadius: "6px",
                width: "80%",
              }}
            >
              <strong>{u.name}</strong> — {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;