import type { Todo } from "../types/todo";

export const mapApiTodoToTodo = (apiTodo: any): Todo => ({
  id: apiTodo._id,          
  title: apiTodo.title,
  description: apiTodo.description,
  status: apiTodo.status,
  priority: apiTodo.priority,
  createdAt: apiTodo.createdAt,
  updatedAt: apiTodo.updatedAt,
});
