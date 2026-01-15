import axios from "axios";
import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

authApi.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);
