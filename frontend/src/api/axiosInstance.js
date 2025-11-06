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

// ♻️ Interceptor tự refresh Access Token
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    console.warn("⚠️ Interceptor caught:", {
      url: originalRequest?.url,
      status: error.response?.status,
      msg: error.response?.data?.message,
    });

    // 🧠 Nếu Access Token hết hạn → refresh
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("⚠️ Không có refreshToken → logout.");
        forceLogout();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;
        if (!newAccessToken) throw new Error("Không nhận được accessToken mới!");

        console.log("✅ Access Token mới:", newAccessToken);
        localStorage.setItem("token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("❌ Refresh token lỗi hoặc hết hạn:", err.message);
        forceLogout();
        return Promise.reject(err);
      }
    }

    // 🚪 Nếu token hết hạn / không hợp lệ → logout
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("⚠️ Token không hợp lệ, logout người dùng.");
      forceLogout();
    }

    return Promise.reject(error);
  }
);

// 🚪 Hàm logout toàn cục
function forceLogout() {
  console.log("🚪 [forceLogout] Triggered!");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // 🔔 Thông báo App.js cập nhật state
  window.dispatchEvent(new Event("logout"));
  window.location.href = "/login";
}

export default API;
