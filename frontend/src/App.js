import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import ViewProfile from "./components/ViewProfile";
import EditProfile from "./components/EditProfile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [reload, setReload] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
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
          {/* --- Các route cơ bản --- */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

          {/* --- Route Profile (chỉ khi đăng nhập) --- */}
          <Route
  path="/profile"
  element={isLoggedIn ? <ViewProfile /> : <Navigate to="/login" />}
/>
<Route
  path="/profile/edit"
  element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />}
/>

          {/* --- Route chính CRUD User (chỉ khi đăng nhập) --- */}
          {isLoggedIn ? (
            <Route
              path="/"
              element={
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
                    🌐 Group 10 - User Management
                  </h1>

                  {/* ✅ Form Thêm user */}
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

                  {/* ✅ Danh sách user */}
                  <UserList reload={reload} />
                </div>
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