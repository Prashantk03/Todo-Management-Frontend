import { todosApi } from "./axiosTodos";
import type { Todo } from "../types/todo";
import { mapApiTodoToTodo } from "../utils/mapTodo";

/******Create Todo******/
export const createTodo = async (data: {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
}) => {
  const res = await todosApi.post("/add", data);
  return mapApiTodoToTodo(res.data.data)
};

/******Get All Todos******/
export const getTodos = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
}) => {
  const res = await todosApi.get("/", { params });
  return {
    items: res.data.data.map(mapApiTodoToTodo), // 👈 backend "data" is the array
    pagination: res.data.pagination,
  };
};

/******Get Todo By ID******/
export const getTodoById = async (id: string) => {
  const res = await todosApi.get(`/get/${id}`);
  return res.data.data as Todo;
};

/******Update Todo******/
export const updateTodo = async (
  id: string,
  data: Partial<Pick<Todo, "title" | "description" | "status" | "priority">>
) => {
  const res = await todosApi.patch(`/update/${id}`, data);
  return res.data.data as Todo;
};

/******Delete Todo******/
export const deleteTodo = async (id: string) => {
  await todosApi.delete(`/delete/${id}`);
};
