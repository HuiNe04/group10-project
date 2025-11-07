// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: true,
});

export default store;
