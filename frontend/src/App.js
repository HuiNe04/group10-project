import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import ViewProfile from "./components/ViewProfile";
import EditProfile from "./components/EditProfile";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [reload, setReload] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
  };
  const refreshUsers = () => setReload((prev) => !prev);

  // 🧠 Theo dõi sự kiện logout toàn cục
  useEffect(() => {
    const handleAutoLogout = () => {
      console.log("🧠 [App] logout event received");
      setIsLoggedIn(false);
    };
    window.addEventListener("logout", handleAutoLogout);
    return () => window.removeEventListener("logout", handleAutoLogout);
  }, []);

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background: "#e9f2ff",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <Routes>
          {/* --- Auth --- */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- Profile --- */}
          <Route
            path="/profile"
            element={isLoggedIn ? <ViewProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/edit"
            element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />}
          />

          {/* --- Admin Dashboard --- */}
          {isLoggedIn ? (
            <Route
              path="/"
              element={
                (() => {
                  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
                  if (!currentUser || currentUser.role !== "admin") {
                    return (
                      <div style={{ textAlign: "center", marginTop: "100px", color: "#333" }}>
                        <h2>🚫 Bạn không có quyền truy cập trang Admin</h2>
                        <p>
                          Chỉ tài khoản có vai trò <b>Admin</b> mới xem được danh sách người dùng.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto" }}>
                      <h1
                        style={{
                          textAlign: "center",
                          color: "#007bff",
                          marginBottom: "25px",
                        }}
                      >
                        🌐 Admin Panel – Quản lý người dùng
                      </h1>
                      <div
                        style={{
                          background: "#fff",
                          padding: "20px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          marginBottom: "30px",
                        }}
                      >
                        <AddUser onUserAdded={refreshUsers} />
                      </div>
                      <UserList reload={reload} />
                    </div>
                  );
                })()
              }
            />
          ) : (
            <Route path="/" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
