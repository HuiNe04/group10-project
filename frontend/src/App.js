import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

function App() {
  const [reload, setReload] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const refreshUsers = () => setReload((prev) => !prev);
  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

        {/* Chỉ cho phép truy cập CRUD nếu đã đăng nhập */}
        {isLoggedIn ? (
          <Route
            path="/"
            element={
              <div style={{ textAlign: "center", fontFamily: "Arial" }}>
                <h1>🌐 Group 10 - User Management</h1>
                <AddUser onUserAdded={refreshUsers} />
                <UserList reload={reload} />
              </div>
            }
          />
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;