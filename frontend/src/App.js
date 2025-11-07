import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./features/authSlice";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import ViewProfile from "./components/ViewProfile";
import EditProfile from "./components/EditProfile";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminLogs from "./components/AdminLogs";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [reload, setReload] = useState(false);
  const refreshUsers = () => setReload((prev) => !prev);

  // 🧠 Khi mở lại trang -> Redux tự load user từ token
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background: "#e9f2ff",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Navbar isLoggedIn={isAuthenticated} />

        <Routes>
          {/* --- Auth routes --- */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- Hồ sơ cá nhân (Protected) --- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ViewProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* --- Trang Logs (Admin Only) --- */}
          <Route
            path="/logs"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLogs />
              </ProtectedRoute>
            }
          />

          {/* --- Trang quản lý người dùng --- */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["admin", "moderator", "user"]}>
                {user?.role === "admin" ? (
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
                ) : user?.role === "moderator" ? (
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
                ) : (
                  <Navigate to="/profile" />
                )}
              </ProtectedRoute>
            }
          />

          {/* --- Fallback: Nếu route không tồn tại --- */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", marginTop: "100px", color: "#555" }}>
                <h2>🚫 Trang không tồn tại</h2>
                <p>Vui lòng quay lại <a href="/">trang chủ</a>.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
