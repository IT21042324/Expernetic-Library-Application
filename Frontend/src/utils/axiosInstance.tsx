// src/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7137/api",
});

// Automatically attach the token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
