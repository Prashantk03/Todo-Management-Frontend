import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    getTodos,
    createTodo,
} from "../api/todos.api";

import type { PaginatedTodos } from "../types/todo";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import TodoSkeleton from "../components/TodoSkeleton";

export default function Todos() {
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery<PaginatedTodos>({
        queryKey: ["todos", page],
        queryFn: () => getTodos({ page, limit: 5 }),
    });

    /******MUTATIONS******/

    const createMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            toast.success("Todo added");
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            setTitle("");
        },

        onError: () => {
            toast.error("Failed to add Todo");
        }
    });

    const handleCreate = () => {
        if (!title.trim()) return;

        createMutation.mutate({
            title,
            description: title,
            priority: "medium",
        })
    }

    {
        isLoading && (
            <ul className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <TodoSkeleton key={i} />
                ))}
            </ul>
        )
    }

    return (
        <>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-semibold text-slate-800 mb-6">
                    My Todos
                </h1>

                {/******Create Todo******/}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="New todo..."
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description..."
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        onClick={handleCreate}
                        disabled={createMutation.isPending}
                        className="w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {createMutation.isPending ? "Adding..." : "Add"}
                    </button>
                </div>

                {!isLoading && data?.items.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-8">
                        No todos yet 🚀
                    </p>
                )}

                {/******Todos List******/}
                {!isLoading && (
                    <ul className="space-y-3">
                        {data?.items.map((todo) => (
                            <li
                                key={todo.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                            >
                                <div>
                                    <p
                                        onClick={() => navigate(`/todos/${todo.id}`)}
                                        className="font-medium text-slate-800 cursor-pointer"
                                    >
                                        {todo.title}
                                    </p>

                                    <p
                                        className={`text-xs mt-1 ${todo.status === "completed"
                                                ? "text-green-600"
                                                : todo.status === "in_progress"
                                                    ? "text-blue-600"
                                                    : "text-yellow-600"
                                            }`}
                                    >
                                        {todo.status}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/******Pagination******/}
                {data && (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
