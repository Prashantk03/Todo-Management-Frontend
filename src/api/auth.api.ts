import { authApi } from "./axiosAuth";
import type { ApiUser } from "../types/user";

/*********REGISTER*********/
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await authApi.post("/register", data);
  return res.data;
};

/***********LOGIN**********/
export const loginUser = async (data: {
  email: string;
  password: string;
  remember?: boolean;
}) => {
  const res = await authApi.post("/login", data);

  return {
    accessToken: res.data.data.accessToken,
    refreshToken: res.data.data.refreshToken,
    user: res.data.data.user as ApiUser,
  };
};

/**********LOGOUT**********/
export const logoutUser = async (refreshToken?: string) => {
  await authApi.post("/logout", { refreshToken });
};
