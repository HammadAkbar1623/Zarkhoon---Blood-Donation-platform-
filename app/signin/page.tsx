"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
const router = useRouter();

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

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();


if (validate()) {
  console.log("Sign in form submitted:", form);
  router.push("/main/feed");
}


};

return ( <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 to-red-800 px-4 py-10 sm:px-6 lg:px-8 overflow-hidden">


  {/* Background shapes */}
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <div className="absolute top-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-96 sm:h-96 bg-red-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
  </div>

  {/* Sign In Card */}
  <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">

      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-red-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.5L6 10.5C4 13.5 4 17 6 20C8 23 12 23 15 20C18 17 18 13.5 16 10.5L12 2.5Z" />
        </svg>

        <h2 className="text-2xl sm:text-3xl font-bold text-red-700">
          Welcome Back
        </h2>
      </div>

      <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
        Sign in to continue saving lives
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={form.Email}
            onChange={(e) =>
              setForm({ ...form, Email: e.target.value })
            }
            className={`w-full rounded-lg border px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-red-500 outline-none ${
              errors.Email ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.Email && (
            <p className="text-xs text-red-600 mt-1">{errors.Email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={form.Password}
            onChange={(e) =>
              setForm({ ...form, Password: e.target.value })
            }
            className={`w-full rounded-lg border px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-red-500 outline-none ${
              errors.Password ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.Password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.Password}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-red-600 hover:text-red-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-sm sm:text-base transition shadow-lg hover:shadow-xl"
        >
          Sign In
        </button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-red-600 font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>

      <p className="text-xs text-center text-gray-400 mt-4">
        Together we can save lives 🩸
      </p>
    </div>
  </div>
</main>

);
}
