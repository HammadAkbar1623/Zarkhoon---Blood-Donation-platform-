"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");

  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    BloodGroup: "",
    Phone: "",
    Address: "",
    Latitude: "",
    Longitude: "",
  });

  const [errors, setErrors] = useState({
    Name: "",
    Email: "",
    Password: "",
    BloodGroup: "",
    Phone: "",
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocationStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          Latitude: position.coords.latitude.toString(),
          Longitude: position.coords.longitude.toString(),
        }));
        setLocationStatus("success");
      },
      (err) => {
        console.error("Location error:", err);
        setLocationStatus("error");
        alert("Unable to retrieve location. Please grant location permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = () => {
    const newErrors = {
      Name: "",
      Email: "",
      Password: "",
      BloodGroup: "",
      Phone: "",
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

    if (!form.Phone.trim()) {
      newErrors.Phone = "Phone number is required for donors";
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
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.Name,
            email: form.Email,
            password: form.Password,
            bloodGroup: form.BloodGroup,
            phone: form.Phone,
            address: form.Address,
            latitude: form.Latitude,
            longitude: form.Longitude,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Signup failed");
        }

        router.push("/main/feed");
      } catch (err: any) {
        setApiError(err.message || "Failed to create account");
      } finally {
        setLoading(false);
      }
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
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg my-6">
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              🩸
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-red-700">Join Zarkhoon</h2>
          </div>

          <p className="text-center text-gray-600 mb-6 text-sm">
            Create an account & help save lives within your 50 km community
          </p>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded-lg">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none ${
                  errors.Name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.Name && <p className="text-xs text-red-600 mt-1">{errors.Name}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.Email}
                  onChange={(e) => setForm({ ...form, Email: e.target.value })}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none ${
                    errors.Email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.Email && <p className="text-xs text-red-600 mt-1">{errors.Email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={form.Phone}
                  onChange={(e) => setForm({ ...form, Phone: e.target.value })}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none ${
                    errors.Phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.Phone && <p className="text-xs text-red-600 mt-1">{errors.Phone}</p>}
              </div>
            </div>

            {/* Password & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.Password}
                  onChange={(e) => setForm({ ...form, Password: e.target.value })}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none ${
                    errors.Password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.Password && <p className="text-xs text-red-600 mt-1">{errors.Password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Blood Group</label>
                <select
                  value={form.BloodGroup}
                  onChange={(e) => setForm({ ...form, BloodGroup: e.target.value })}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none ${
                    errors.BloodGroup ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                {errors.BloodGroup && <p className="text-xs text-red-600 mt-1">{errors.BloodGroup}</p>}
              </div>
            </div>

            {/* Geolocation Button */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Location Coordinates (For 50 km Alerts)</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={detectLocation}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
                >
                  📍 {locationStatus === "detecting" ? "Detecting location..." : locationStatus === "success" ? "Location Detected ✓" : "Detect My Live Location"}
                </button>
              </div>
              {form.Latitude && (
                <p className="text-[11px] text-green-600 mt-1">
                  Latitude: {parseFloat(form.Latitude).toFixed(4)}, Longitude: {parseFloat(form.Longitude).toFixed(4)}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City / Address (Optional)</label>
              <input
                type="text"
                placeholder="Lahore, Pakistan"
                value={form.Address}
                onChange={(e) => setForm({ ...form, Address: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-sm transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Sign in */}
          <p className="text-center text-gray-600 mt-5 text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-red-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}