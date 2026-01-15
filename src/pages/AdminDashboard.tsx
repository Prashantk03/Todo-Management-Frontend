import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users.api";
import Navbar from "../components/Navbar";
import { mapApiUserToAuthUser } from "../utils/mapUser";
import { useNavigate } from "react-router-dom";
import AdminSkeleton from "../components/AdminSkeleton";
import type { ApiUser } from "../types/user";


export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();


  const {
    data,
    isLoading,
    isError,
  } = useQuery<{
    items: ApiUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ["users", page],
    queryFn: () => getUsers({ page, limit: 5 }),
  });

  const users = (data?.items ?? []).map(mapApiUserToAuthUser);

  /******Guard******/
  if (isError) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-6 text-red-600">
          Failed to load users
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            Admin – Users
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-slate-200 rounded-lg bg-white shadow-sm">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <AdminSkeleton key={i} />
                ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
              {!isLoading &&
                users.map((user) => (
                  <tr key={user.id} className="text-sm text-slate-700">
                    <td className="px-4 py-3 font-medium">
                      {user.name}
                    </td>

                    <td className="px-4 py-3">
                      {user.email}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${user.role === "ADMIN"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className="text-indigo-600 text-xs font-medium"
                        >
                          Manage
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/******Pagination******/}
        {data?.pagination && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-slate-100 transition"
            >
              Prev
            </button>

            <span className="text-sm text-slate-600">
              Page {data.pagination.page} of{" "}
              {data.pagination.totalPages}
            </span>

            <button
              disabled={page === data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-slate-100 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
