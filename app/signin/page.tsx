"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    Email: "",
    Password: "",
  });

  const [errors, setErrors] = useState({
    Email: "",
    Password: "",
  });

  const validate = () => {
    const newErrors = {
      Email: "",
      Password: "",
    };

    let isValid = true;

    if (!form.Email.trim()) {
      newErrors.Email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.Email)) {
      newErrors.Email = "Email is invalid";
      isValid = false;
    }

    if (!form.Password) {
      newErrors.Password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (validate()) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.Email,
            password: form.Password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Invalid credentials");
        }

        router.push("/main/feed");
      } catch (err: any) {
        setApiError(err.message || "Failed to sign in");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 to-red-800 px-4 py-10 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-96 sm:h-96 bg-red-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Sign In Card */}
      <div className="relative w-full max-w-sm sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              🩸
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-red-700">Welcome Back</h2>
          </div>

          <p className="text-center text-gray-600 mb-6 text-sm">
            Sign in to continue saving lives
          </p>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded-lg">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.Email}
                onChange={(e) => setForm({ ...form, Email: e.target.value })}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none ${
                  errors.Email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Email && <p className="text-xs text-red-600 mt-1">{errors.Email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.Password}
                onChange={(e) => setForm({ ...form, Password: e.target.value })}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none ${
                  errors.Password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Password && <p className="text-xs text-red-600 mt-1">{errors.Password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-sm transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-gray-600 mt-6 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-red-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
