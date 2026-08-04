"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    BloodGroup: "",
  });

  const [errors, setErrors] = useState({
    Name: "",
    Email: "",
    Password: "",
    BloodGroup: "",
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const validate = () => {
    const newErrors = {
      Name: "",
      Email: "",
      Password: "",
      BloodGroup: "",
    };

    let isValid = true;

    if (!form.Name.trim()) {
      newErrors.Name = "Name is required";
      isValid = false;
    }

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
    } else if (form.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!form.BloodGroup.trim()) {
      newErrors.BloodGroup = "Please select your blood group";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      console.log("Form submitted:", form);
      router.push("/main/feed");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 to-red-800 px-4 py-10 sm:px-6 lg:px-8 overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-96 sm:h-96 bg-red-300 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl p-6 sm:p-8 md:p-10">

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
              Join Zarkhoon
            </h2>
          </div>

          <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
            Create an account to start saving lives
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={form.Name}
                onChange={(e) =>
                  setForm({ ...form, Name: e.target.value })
                }
                className={`w-full rounded-lg border px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-red-500 outline-none ${
                  errors.Name ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors.Name && (
                <p className="text-xs text-red-600 mt-1">{errors.Name}</p>
              )}
            </div>

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
                placeholder="Minimum 6 characters"
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

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>

              <select
                value={form.BloodGroup}
                onChange={(e) =>
                  setForm({ ...form, BloodGroup: e.target.value })
                }
                className={`w-full rounded-lg border px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white focus:ring-2 focus:ring-red-500 outline-none ${
                  errors.BloodGroup ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select your blood group</option>

                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>

              {errors.BloodGroup && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.BloodGroup}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-sm sm:text-base transition shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
          </form>

          {/* Sign in */}
          <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-red-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="text-xs text-center text-gray-400 mt-4">
            By joining, you agree to be a hero 🩸
          </p>
        </div>
      </div>
    </main>
  );
}