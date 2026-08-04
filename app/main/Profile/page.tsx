"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      } else if (res.status === 401) {
        router.push("/signin");
      }
    } catch (e) {
      console.error("Profile fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailable = async () => {
    if (!profile) return;
    const newStatus = !profile.isAvailable;
    setProfile({ ...profile, isAvailable: newStatus });
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      if (res.ok) {
        setMsg(`Availability updated: You are now ${newStatus ? "Available for donation" : "Unavailable"}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSaving(true);
        try {
          const res = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude: lat, longitude: lng }),
          });
          if (res.ok) {
            setProfile((prev: any) => ({ ...prev, latitude: lat, longitude: lng }));
            setMsg("Location updated successfully! Donors will find you in 50 km searches.");
          }
        } catch (e) {
          console.error(e);
        } finally {
          setSaving(false);
        }
      },
      (err) => alert("Failed to acquire location permission")
    );
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">Loading your donor profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {profile.bloodGroup}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-xs text-gray-500">{profile.email} • {profile.phone || "No phone added"}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-gray-600">Member since {new Date(profile.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-xl text-center">
            <span className="block text-[10px] uppercase font-bold text-red-600">Blood Type</span>
            <span className="text-xl font-black text-red-700">{profile.bloodGroup}</span>
          </div>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl">
            {msg}
          </div>
        )}

        {/* Availability Toggle */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Donor Availability</h3>
            <p className="text-xs text-gray-500">
              When active, you will receive emergency notifications within 50 km.
            </p>
          </div>

          <button
            onClick={handleToggleAvailable}
            disabled={saving}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              profile.isAvailable
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-700"
            }`}
          >
            {profile.isAvailable ? "✓ Available to Donate" : "Off / Unavailable"}
          </button>
        </div>

        {/* Location Info */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Live GPS Coordinates</h3>
            <p className="text-xs text-gray-500">
              {profile.latitude && profile.longitude
                ? `Lat: ${parseFloat(profile.latitude).toFixed(4)}, Lng: ${parseFloat(profile.longitude).toFixed(4)}`
                : "No location saved"}
            </p>
          </div>

          <button
            onClick={handleUpdateLocation}
            disabled={saving}
            className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg transition"
          >
            📍 Update Location
          </button>
        </div>
      </div>

      {/* History Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Your Requests */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>📋 Your Blood Requests</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
              {profile.requests?.length || 0}
            </span>
          </h3>

          {profile.requests?.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No requests placed yet.</p>
          ) : (
            <div className="space-y-2">
              {profile.requests?.map((r: any) => (
                <div key={r.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{r.patientName} ({r.bloodGroup})</span>
                    <span className={r.status === "ARRANGED" ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-gray-500">{r.hospitalName}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Donations */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>❤️ Donations Accepted</span>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
              {profile.acceptances?.length || 0}
            </span>
          </h3>

          {profile.acceptances?.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No donations accepted yet.</p>
          ) : (
            <div className="space-y-2">
              {profile.acceptances?.map((a: any) => (
                <div key={a.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>For {a.request?.patientName}</span>
                    <span className="text-emerald-700 font-bold">✓ Accepted</span>
                  </div>
                  <p className="text-gray-500">{a.request?.hospitalName} ({a.request?.bloodGroup})</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
