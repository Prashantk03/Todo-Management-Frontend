import axios from "axios";
import { store } from "../app/store";

export const todosApi = axios.create({
  baseURL: "/api/v1/todos",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

todosApi.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
