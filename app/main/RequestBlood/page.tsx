"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RequestBloodPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");

  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    unitsNeeded: 1,
    hospitalName: "",
    address: "",
    contactNumber: "",
    urgency: "EMERGENCY",
    latitude: "",
    longitude: "",
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    // Attempt auto-location detection on page mount
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocationStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
        setLocationStatus("success");
      },
      (err) => {
        console.error("Location error", err);
        setLocationStatus("error");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessData(null);

    if (!form.latitude || !form.longitude) {
      alert("Please enable or detect your location to send emergency requests to donors within 50 km!");
      detectLocation();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post blood request");

      setSuccessData(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚨</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Request Emergency Blood</h1>
        </div>
        <p className="text-red-100 text-sm sm:text-base">
          Fill out the emergency details below. Zarkhoon will automatically alert all available donors matching this blood group within a **50 km radius** in real-time.
        </p>
      </div>

      {/* Success Alert Banner */}
      {successData && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 shadow-md text-emerald-900 space-y-3">
          <div className="flex items-center gap-2 font-bold text-lg text-emerald-700">
            <span>✅ Blood Request Broadcasted Successfully!</span>
          </div>
          <p className="text-sm">
            Emergency alert dispatched to <strong className="text-emerald-800 font-extrabold">{successData.notifiedDonorsCount} donor(s)</strong> within a 50 km radius.
          </p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => router.push("/main/NearbyRequest")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
            >
              View In Nearby Requests ➔
            </button>
            <button
              onClick={() => setSuccessData(null)}
              className="bg-white border border-emerald-300 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-50 transition"
            >
              Post Another Request
            </button>
          </div>
        </div>
      )}

      {/* Form Card */}
      {!successData && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patient Name & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Khan"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Urgency Level
                </label>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none font-semibold text-red-600"
                >
                  <option value="EMERGENCY">🚨 EMERGENCY (Immediate)</option>
                  <option value="NORMAL">⏳ NORMAL (Within 24 hours)</option>
                </select>
              </div>
            </div>

            {/* Blood Group & Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Required Blood Group *
                </label>
                <select
                  required
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none font-bold"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bags / Units Needed
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.unitsNeeded}
                  onChange={(e) => setForm({ ...form, unitsNeeded: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Hospital & Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hospital / Medical Center Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mayo Hospital Emergency Ward"
                value={form.hospitalName}
                onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 9876543"
                  value={form.contactNumber}
                  onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City / Area Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anarkali, Lahore"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Live Geolocation Section */}
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-red-800">50 km Radius GPS Targeting</p>
                  <p className="text-[11px] text-red-600">
                    Live GPS coordinates ensure alerts reach donors nearby.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={detectLocation}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  {locationStatus === "detecting" ? "Detecting..." : "Update Live GPS"}
                </button>
              </div>

              {form.latitude && (
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <span>📍 GPS Acquired:</span>
                  <span>{parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}</span>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl text-base transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Broadcasting Request..." : "📢 Broadcast Emergency Blood Request"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
