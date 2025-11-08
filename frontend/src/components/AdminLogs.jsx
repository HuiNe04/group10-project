import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import Swal from "sweetalert2";

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Gọi API lấy log khi vào trang
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/logs");
        setLogs(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải logs:", err.message);
        Swal.fire("❌ Lỗi", "Không thể tải nhật ký hoạt động!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        ⏳ Đang tải nhật ký...
      </p>
    );
  }

  return (
    <div style={container}>
      <h2 style={title}>🧾 Nhật ký hoạt động người dùng</h2>

      {logs.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          Chưa có hoạt động nào được ghi nhận.
        </p>
      ) : (
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRow}>
                <th style={cellStyle}>👤 Người dùng</th>
                <th style={cellStyle}>🎯 Hành động</th>
                <th style={cellStyle}>🌐 IP</th>
                <th style={cellStyle}>🕒 Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                  <td style={cellStyle}>
                    {log.userId?.name || "Khách (Chưa đăng nhập)"}
                  </td>
                  <td style={cellStyle}>{log.action}</td>
                  <td style={cellStyle}>{log.ip}</td>
                  <td style={cellStyle}>
                    {new Date(log.timestamp).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 💅 Style hiện đại
const container = {
  padding: "30px",
  maxWidth: "1100px",
  margin: "0 auto",
  background: "#f8f9fa",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const title = {
  textAlign: "center",
  color: "#007bff",
  fontWeight: "600",
  marginBottom: "25px",
};

const tableContainer = {
  overflowX: "auto",
  borderRadius: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const headerRow = {
  background: "#007bff",
  color: "white",
  textAlign: "left",
  fontWeight: "bold",
};

const rowEven = {
  background: "#f2f6fc",
};

const rowOdd = {
  background: "#ffffff",
};

const cellStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #dee2e6",
};

export default AdminLogs;
