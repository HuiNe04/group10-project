import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/users", form);
    setForm({ name: "", email: "" });
    onUserAdded();
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