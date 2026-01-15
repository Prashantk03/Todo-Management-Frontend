export type TodoStatus = "pending" | "in_progress" | "completed";
export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority?: TodoPriority;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTodos {
  items: Todo[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
