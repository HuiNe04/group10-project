// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🚫 Không có quyền truy cập</h2>
        <p>Chỉ {roles.join(", ")} được phép vào trang này.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
