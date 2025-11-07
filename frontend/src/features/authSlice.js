// src/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

// 🧠 Lấy user từ token (dành cho refresh trang)
export const loadUser = createAsyncThunk("auth/loadUser", async (_, thunkAPI) => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Token không hợp lệ");
  }
});

// 🔑 Đăng nhập
export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const res = await API.post("/auth/login", credentials);
    const { accessToken, refreshToken, user } = res.data;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Sai thông tin đăng nhập");
  }
});

// 🚪 Đăng xuất
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) await API.post("/auth/logout", { refreshToken });
  } catch (err) {
    console.warn("⚠️ Lỗi khi gọi API logout:", err.message);
  } finally {
    localStorage.clear();
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Đăng nhập
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load user
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
