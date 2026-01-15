import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 mb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/***Logo***/}
          <strong className="text-lg font-semibold text-indigo-600">
            Todo App
          </strong>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/todos" className="text-slate-600 hover:text-indigo-600">
              Todos
            </Link>

            <Link to="/profile" className="text-slate-600 hover:text-indigo-600">
              Profile
            </Link>

            {user.role === "ADMIN" && (
              <Link to="/admin" className="text-slate-600 hover:text-indigo-600">
                Admin
              </Link>
            )}

            <span className="text-slate-700">{user.name}</span>

            <button
              onClick={handleLogout}
              className="rounded-md bg-red-500 px-3 py-1.5 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/***Hamburger***/}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
          >
            <span
              className={`absolute h-0.5 w-6 bg-slate-700 transition-all duration-300
      ${open ? "rotate-45 translate-y-0" : "-translate-y-2"}
    `}
            />
            <span
              className={`absolute h-0.5 w-6 bg-slate-700 transition-all duration-300
      ${open ? "opacity-0" : "opacity-100"}
    `}
            />
            <span
              className={`absolute h-0.5 w-6 bg-slate-700 transition-all duration-300
      ${open ? "-rotate-45 translate-y-0" : "translate-y-2"}
    `}
            />
          </button>

        </div>

        {/***Mobile Slide Menu***/}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${open ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
          `}
        >
          <div className="py-4 space-y-3 text-sm">
            <Link
              to="/todos"
              onClick={() => setOpen(false)}
              className="block text-slate-600 hover:text-indigo-600"
            >
              Todos
            </Link>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="block text-slate-600 hover:text-indigo-600"
            >
              Profile
            </Link>

            {user.role === "ADMIN" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="block text-slate-600 hover:text-indigo-600"
              >
                Admin
              </Link>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-700">{user.name}</span>

              <button
                onClick={handleLogout}
                className="rounded-md bg-red-500 px-3 py-1.5 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
