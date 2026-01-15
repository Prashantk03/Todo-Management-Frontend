import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api/auth.api";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const { register, handleSubmit } = useForm<SignupForm>();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: SignupForm) => {
    try {
      setLoading(true);
      setError("");

      await registerUser(data);

      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
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
          Create Account
        </h1>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-600">
            {success}
          </p>
        )}

        {/******Name******/}
        <input
          {...register("name", { required: true })}
          placeholder="Full name"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

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

        {/******Submit******/}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p className="text-sm text-center text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );

}
