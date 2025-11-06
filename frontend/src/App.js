import React, { useState } from "react";
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
    localStorage.clear();
    setIsLoggedIn(false);
  };
  const refreshUsers = () => setReload((prev) => !prev);

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
          {/* --- Auth routes --- */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- Hồ sơ cá nhân: tất cả role đều vào được --- */}
          <Route
            path="/profile"
            element={isLoggedIn ? <ViewProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/edit"
            element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />}
          />

          {/* --- Trang quản lý User --- */}
          {isLoggedIn ? (
            <Route
              path="/"
              element={
                (() => {
                  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
                  if (!currentUser) return <Navigate to="/login" />;

                  // ✅ ADMIN: CRUD user
                  if (currentUser.role === "admin") {
                    return (
                      <div
                        style={{
                          padding: "40px 20px",
                          maxWidth: "1000px",
                          margin: "0 auto",
                        }}
                      >
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

                        <UserList reload={reload} readonly={false} />
                      </div>
                    );
                  }

                  // ✅ MODERATOR: chỉ xem danh sách user
                  if (currentUser.role === "moderator") {
                    return (
                      <div
                        style={{
                          padding: "40px 20px",
                          maxWidth: "1000px",
                          margin: "0 auto",
                        }}
                      >
                        <h1
                          style={{
                            textAlign: "center",
                            color: "#28a745",
                            marginBottom: "25px",
                          }}
                        >
                          👀 Moderator – Xem danh sách người dùng
                        </h1>

                        <UserList reload={reload} readonly={true} />
                      </div>
                    );
                  }

                  // ✅ USER: chuyển về hồ sơ cá nhân
                  return <Navigate to="/profile" />;
                })()
              }
            />
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
