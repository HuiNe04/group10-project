import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email } = form;

    if (!name.trim()) {
      alert("⚠️ Name không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("⚠️ Email không hợp lệ");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users", form);
      alert("✅ Thêm user thành công!");
      setForm({ name: "", email: "" });
      onUserAdded(); // gọi callback báo App reload
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err.message);
      alert("Không thể thêm user! Kiểm tra backend.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <button type="submit">Thêm User</button>
    </form>
  );
}

export default AddUser;