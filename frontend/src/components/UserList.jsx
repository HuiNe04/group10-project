import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Lấy dữ liệu users từ backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };

  // Tự động gọi khi component render lần đầu
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.card}>
      <h2>📋 Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <b>{user.name}</b> - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    width: "400px",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
  },
};

export default UserList;