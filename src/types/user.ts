/******BACKEND => API USER******/

export type ApiUserRole = "user" | "admin";

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: ApiUserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  items: ApiUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
