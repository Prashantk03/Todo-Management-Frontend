import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Todos from "./pages/Todos";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminUserDetail from "./pages/AdminUserDetail";
import TodoDetail from "./pages/TodoDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/******DEFAULT REDIRECT******/}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/******PUBLIC ROUTES******/}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/******USER ROUTES******/}
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todos/:id"
          element={
            <ProtectedRoute>
              <TodoDetail />
            </ProtectedRoute>
          }
        />

        {/******ADMIN ROUTES******/}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminRoute>
              <AdminUserDetail />
            </AdminRoute>
          }
        />

        {/* OPTIONAL: 404 */}
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}
