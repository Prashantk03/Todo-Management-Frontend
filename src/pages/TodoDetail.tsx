import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoById, updateTodo, deleteTodo } from "../api/todos.api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { useState } from "react";

export default function TodoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: todo, isLoading } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => getTodoById(id!),
    enabled: !!id,
  });

  /******MUTATIONS******/
  
  const updateMutation = useMutation({
    mutationFn: (data: {
      title?: string;
      description?: string;
      status?: "pending" | "in_progress" | "completed";
    }) => updateTodo(id!, data),
    onSuccess: () => {
      toast.success("Todo updated");
      queryClient.invalidateQueries({ queryKey: ["todo", id] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTodo(id!),
    onSuccess: () => {
      toast.success("Todo deleted");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate("/todos");
    },
  });

  if (isLoading || !todo) {
    return (
      <>
        <Navbar />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-indigo-600 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold mb-6">Manage Todo</h1>

        {/******Title******/}
        <div className="mb-4">
          <label className="text-sm font-medium">Title</label>
          <input
            defaultValue={todo.title}
            onBlur={(e) =>
              e.target.value !== todo.title &&
              updateMutation.mutate({ title: e.target.value })
            }
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/******Description******/}
        <div className="mb-4">
          <label className="text-sm font-medium">Description</label>
          <textarea
            defaultValue={todo.description}
            onBlur={(e) =>
              e.target.value !== todo.description &&
              updateMutation.mutate({ description: e.target.value })
            }
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {/******Status******/}
        <div className="mb-6">
          <label className="text-sm font-medium">Status</label>
          <select
            value={todo.status}
            onChange={(e) =>
              updateMutation.mutate({
                status: e.target.value as
                  | "pending"
                  | "in_progress"
                  | "completed",
              })
            }
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/******Delete******/}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-medium text-red-700">Danger Zone</h2>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
            >
              Delete Todo
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => deleteMutation.mutate()}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
