import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import AdminSkeleton from "../components/AdminSkeleton";

import {
    getUserById,
    updateUser,
    deleteUser,
    resetUserPassword,
} from "../api/users.api";

import { mapApiUserToAuthUser } from "../utils/mapUser";
import type { AuthUser } from "../features/auth/authTypes";

export default function AdminUserDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [newPassword, setNewPassword] = useState("");
    const [confirmAction, setConfirmAction] = useState<
        "role" | "delete" | null
    >(null);

    /******FETCH USER******/

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserById(id!),
        enabled: !!id,
    });

    const user: AuthUser | null = data
        ? mapApiUserToAuthUser(data)
        : null;

    /******MUTATIONS******/

    const roleMutation = useMutation({
        mutationFn: (role: "USER" | "ADMIN") =>
            updateUser(id!, { role }),
        onSuccess: () => {
            toast.success("User role updated");
            queryClient.invalidateQueries({ queryKey: ["user", id] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err: any) =>
            toast.error(err.response?.data?.message || "Failed to update role"),
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteUser(id!),
        onSuccess: () => {
            toast.success("User deleted");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            navigate("/admin");
        },
        onError: (err: any) =>
            toast.error(err.response?.data?.message || "Failed to delete user"),
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (password: string) =>
            resetUserPassword(id!, password),
        onSuccess: () => {
            toast.success("Password reset successfully");
            setNewPassword("");
        },
        onError: (err: any) =>
            toast.error(
                err.response?.data?.message || "Failed to reset password"
            ),
    });

    /******GUARDS******/

    if (isLoading) {
        return (
            <>
                <Navbar />
                <AdminSkeleton />
            </>
        );
    }

    if (isError || !user) {
        return (
            <>
                <Navbar />
                <p className="text-center mt-8 text-red-600">
                    Failed to load user
                </p>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Manage User
                    </h1>

                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-slate-600 hover:underline"
                    >
                        ← Back
                    </button>
                </div>

                {/******User Info******/}
                <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                    <h2 className="mb-4 text-lg font-medium text-slate-700">
                        Profile
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">Name</p>
                            <p className="font-medium">{user.name}</p>
                        </div>

                        <div>
                            <p className="text-slate-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-slate-500">Role</p>
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${user.role === "ADMIN"
                                        ? "bg-indigo-100 text-indigo-700"
                                        : "bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/******Admin Actions******/}
                <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                    <h2 className="mb-4 text-lg font-medium text-slate-700">
                        Admin Actions
                    </h2>

                    <button
                        onClick={() => setConfirmAction("role")}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                        Make Admin
                    </button>

                    <div className="mt-6">
                        <p className="mb-2 text-sm font-medium">
                            Reset Password
                        </p>

                        <div className="flex gap-3">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                className="flex-1 rounded-md border px-3 py-2 text-sm"
                            />

                            <button
                                disabled={!newPassword || resetPasswordMutation.isPending}
                                onClick={() => resetPasswordMutation.mutate(newPassword)}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                            >
                                {resetPasswordMutation.isPending ? "Resetting..." : "Reset"}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Must be 8+ chars with uppercase & lowercase letters
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                    <h2 className="mb-4 text-lg font-medium text-red-700">
                        Remove User
                    </h2>

                    <button
                        onClick={() => setConfirmAction("delete")}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Delete User
                    </button>
                </div>
            </div>

            {/******CONFIRMATIONS******/}
            {confirmAction === "role" && (
                <ConfirmOverlay
                    title="Change user role?"
                    description="This will immediately affect user permissions."
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={() => {
                        roleMutation.mutate(
                            user.role === "ADMIN" ? "USER" : "ADMIN"
                        );
                        setConfirmAction(null);
                    }}
                />
            )}

            {confirmAction === "delete" && (
                <ConfirmOverlay
                    danger
                    title="Delete user?"
                    description="This action is irreversible."
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={() => {
                        deleteMutation.mutate();
                        setConfirmAction(null);
                    }}
                />
            )}
        </>
    );
}

/******CONFIRM OVERLAY******/

function ConfirmOverlay({
    title,
    description,
    danger,
    onConfirm,
    onCancel,
}: {
    title: string;
    description: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="mb-6 text-sm text-slate-600">{description}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`rounded-md px-4 py-2 text-sm text-white ${danger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
