import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useAppDispatch } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";

interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError("");

      const res = await loginUser(data);
      
      dispatch(
        loginSuccess({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );

      /******Role-based redirect******/
      if (res.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/todos");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
      >
        <h1 className="text-2xl font-semibold text-center text-slate-800">
          Login
        </h1>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/******Email******/}
        <input
          {...register("email", { required: true })}
          placeholder="Email"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/******Password******/}
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            {...register("remember")}
            className="rounded border-slate-300"
          />
          Remember me
        </label>

        {/******Submit******/}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-slate-600">
          No account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );

}
