import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "./authTypes";

const storedAuth = localStorage.getItem("auth");

const initialState: AuthState = storedAuth
  ? {
      ...JSON.parse(storedAuth),
      isAuthenticated: true,
    }
  : {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
      }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem("auth", JSON.stringify(action.payload));
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
    },

    updateUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },

    updateAvatar(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateUser, updateAvatar } =
  authSlice.actions;

export default authSlice.reducer;
