"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FeedPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    fetchRequests();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const arrangedRequests = requests.filter((r) => r.status === "ARRANGED");

  return (
    <div className="space-y-8">
      {/* Hero Callout Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
            <span>🩸 50 km Real-Time Emergency Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h1>

          <p className="text-red-100 text-sm sm:text-base leading-relaxed">
            Every drop matters. When you place an emergency request on Zarkhoon, active donors with matching blood groups within 50 km are alerted instantly.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/main/RequestBlood"
              className="bg-white text-red-700 hover:bg-gray-100 font-bold px-6 py-3 rounded-2xl text-sm transition shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>🚨 Request Blood Now</span>
            </Link>

            <Link
              href="/main/NearbyRequest"
              className="bg-red-900/50 hover:bg-red-900/70 border border-white/30 text-white font-bold px-6 py-3 rounded-2xl text-sm transition flex items-center gap-2"
            >
              <span>📍 View Nearby Requests</span>
            </Link>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-500/30 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Emergencies</p>
            <p className="text-3xl font-black text-red-600 mt-1">{pendingRequests.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold">
            🚨
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Requests Arranged</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{arrangedRequests.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            ✅
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Blood Type</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{user?.bloodGroup || "—"}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center text-xl font-bold">
            🩸
          </div>
        </div>
      </div>

      {/* Live Recent Emergency Requests Stream */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🔥 Live Emergency Stream</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Real-time requests across all areas</p>
          </div>

          <Link href="/main/NearbyRequest" className="text-xs font-bold text-red-600 hover:underline">
            View All Nearby ➔
          </Link>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-400">Updating stream...</p>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No emergency requests logged yet. Be the first to create one if needed!
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="divide-y divide-gray-100">
            {requests.slice(0, 5).map((r) => (
              <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    {r.bloodGroup}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{r.patientName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        r.status === "ARRANGED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{r.hospitalName} • {r.address || "Location specified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-semibold text-gray-500">
                    {r.unitsNeeded} {r.unitsNeeded === 1 ? "unit" : "units"}
                  </span>
                  <Link
                    href="/main/NearbyRequest"
                    className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg border border-red-200 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
