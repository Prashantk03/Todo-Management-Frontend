import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import {
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
} from "../api/users.api";

import {
  updateUser,
  updateAvatar,
} from "../features/auth/authSlice";

import { mapApiUserToAuthUser } from "../utils/mapUser";
import type { ApiUser as ApiUser } from "../types/user";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import ProfileSkeleton from "../components/ProfileSkeleton";

export default function Profile() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /******Fetch Profile******/
  const {
    data: user,
    isLoading,
  } = useQuery<ApiUser>({
    queryKey: ["me"],
    queryFn: getMe,
  });

  useEffect(() => {
    if (user) {
      dispatch(updateUser(mapApiUserToAuthUser(user)));
      setName(user.name);
    }
  }, [user, dispatch]);


  /******Update Profile******/
  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (user: ApiUser) => {
      toast.success("Profile updated")
      dispatch(updateUser(mapApiUserToAuthUser(user)));
    },

    onError: () => {
      toast.error("Failed to update profile")
    }
  });

  /******Change Password******/
  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    },

    onError: () => {
      toast.error("Failed to update Password")
    }
  });

  /******Upload Avatar******/
  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (user: ApiUser) => {
      toast.success("Avatar Uploaded")
      dispatch(updateAvatar(mapApiUserToAuthUser(user)));
    },

    onError: () => {
      toast.error("Failed to update Avatar")
    }
  });

  if (isLoading || !authUser) {
    return (
      <>
      <Navbar/>
      <ProfileSkeleton/>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Profile
        </h1>

        {/******Avatar Section******/}
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={
              authUser.avatar
                ? `data:image/jpeg;base64,${authUser.avatar}`
                : "/avatar-placeholder.png"
            }
            alt="avatar"
            className="h-20 w-20 rounded-full object-cover border border-slate-300"
          />

          <label className="cursor-pointer text-sm text-indigo-600 hover:underline">
            Change avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  avatarMutation.mutate(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>


        <hr className="my-6" />

        {/******Update Profile******/}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800">
            Update Profile
          </h3>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            disabled={profileMutation.isPending}
            onClick={() => profileMutation.mutate({ name })}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            Update Profile
          </button>
        </div>

        <hr className="my-6" />

        {/******Change Password******/}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800">
            Change Password
          </h3>

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            disabled={passwordMutation.isPending}
            onClick={() => {
              if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
              }

              passwordMutation.mutate({
                currentPassword,
                newPassword,
                confirmPassword,
              });
            }}
            className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50 transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </>
  );

}
