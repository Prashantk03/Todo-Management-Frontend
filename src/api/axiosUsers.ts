import axios from "axios";
import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";

export const usersApi = axios.create({
  baseURL: "/api/v1/users",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

usersApi.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

usersApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);
