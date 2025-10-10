import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/users", form);
      setForm({ name: "", email: "" });
      onUserAdded(); // gọi lại hàm reload bên App.js
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      alert("Không thể thêm user, vui lòng kiểm tra backend!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}
    >
      <input
        type="text"
        placeholder="Tên"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        style={{ marginLeft: "10px" }}
      />
      <button type="submit" style={{ marginLeft: "10px" }}>
        Thêm
      </button>
    </form>
  );
}

export default AddUser;