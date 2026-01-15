import { usersApi } from "./axiosUsers";
import type { ApiUser } from "../types/user";

/*------USER------*/

/******Get current user******/
export const getMe = async (): Promise<ApiUser> => {
  const res = await usersApi.get("/me");
  return res.data.data;
};

/******Update profile******/
export const updateProfile = async (data: { name: string }): Promise<ApiUser> => {
  const res = await usersApi.patch("/me", data);
  return res.data.data;
};

/******Change password******/
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> => {
  await usersApi.post("/me/change-password", data);
};

/******Upload avatar******/
export const uploadAvatar = async (file: File): Promise<ApiUser> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await usersApi.post("/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

/*------ADMIN------*/

/******Get all users******/
export const getUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: "USER" | "ADMIN";
}) => {
  const res = await usersApi.post("/", params);
  return {
    items: res.data.data,
    pagination: res.data.pagination,
  };
};

/******Get user by ID******/
export const getUserById = async (id: string) => {
  const res = await usersApi.get(`/${id}`);
  return res.data.data as ApiUser;
};

/******Update user******/
export const updateUser = async (
  id: string,
  data: { name?: string; role?: "USER" | "ADMIN" }
) => {
  const res = await usersApi.patch(`/${id}`, {
    role: data.role?.toLowerCase(),
  });
  return res.data.data;
};

/******Reset user password******/
export const resetUserPassword = async (id: string, password: string) => {
  const res = await usersApi.post(`/${id}/reset-password`, {
    password,
  });
  return res.data;
};

/******Delete user******/
export const deleteUser = async (id: string) => {
  await usersApi.delete(`/${id}`);
};
