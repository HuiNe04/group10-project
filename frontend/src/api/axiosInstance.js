// src/api/axiosInstance.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return forceLogout();

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;
        if (!newAccessToken) throw new Error("Không nhận được accessToken mới!");
        localStorage.setItem("token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("❌ Refresh token lỗi:", err.message);
        forceLogout();
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      forceLogout();
    }

    return Promise.reject(error);
  }
);

function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("logout"));
  window.location.href = "/login";
}

export default API;
