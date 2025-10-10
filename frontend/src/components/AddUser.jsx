import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users", { name, email });
      alert("✅ Thêm user thành công!");
      setName("");
      setEmail("");
      onUserAdded(); // Cập nhật lại danh sách
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      alert("❌ Thêm thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>➕ Thêm người dùng</h2>
      <input
        type="text"
        placeholder="Nhập tên..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Nhập email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.btn}>
        Thêm
      </button>
    </form>
  );
};

const styles = {
  form: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    width: "400px",
    margin: "20px auto",
    backgroundColor: "#e6f2ff",
  },
  input: {
    padding: "10px",
    margin: "5px 0",
    borderRadius: "6px",
    border: "1px solid #999",
  },
  btn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AddUser;