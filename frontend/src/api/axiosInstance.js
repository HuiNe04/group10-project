// src/api/axiosInstance.js
import axios from "axios";

// 🔧 Tạo axios instance gốc
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

// 🪙 Gắn Access Token vào mọi request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ♻️ Xử lý tự refresh Access Token khi hết hạn
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Nếu backend trả lỗi 403 → Access Token hết hạn
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      // Nếu không có refreshToken → logout
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // 🔄 Gửi request làm mới token
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = response.data.accessToken;
        if (!newAccessToken) throw new Error("Không nhận được accessToken mới!");

        // ✅ Lưu Access Token mới và gắn lại header
        localStorage.setItem("token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Gửi lại request ban đầu
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token không hợp lệ, buộc logout:", refreshError.message);
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
