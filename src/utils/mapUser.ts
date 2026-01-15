import type { AuthUser } from "../features/auth/authTypes";
import type { ApiUser } from "../types/user";

export function mapApiUserToAuthUser(user: ApiUser): AuthUser {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role.toUpperCase() as "USER" | "ADMIN",
    avatar: user.avatar,
  };
}
