"use client";

import { useState, useEffect } from "react";

export default function NearbyRequestPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [filterRadius, setFilterRadius] = useState(50);
  const [filterBlood, setFilterBlood] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    // Acquire user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          fetchNearbyRequests(coords.lat, coords.lng);
        },
        () => {
          fetchNearbyRequests(null, null);
        }
      );
    } else {
      fetchNearbyRequests(null, null);
    }
  }, []);

  const fetchNearbyRequests = async (lat: number | null, lng: number | null) => {
    setLoading(true);
    try {
      let url = "/api/requests";
      if (lat !== null && lng !== null) {
        url += `?lat=${lat}&lng=${lng}&radius=${filterRadius}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Fetch requests error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to donate blood for this emergency request?")) return;

    setAcceptingId(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}/accept`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to accept request");
      } else {
        alert("🎉 Thank you! Request status is now marked as ARRANGED. The requester has been notified with your contact details.");
        // Refresh list
        fetchNearbyRequests(userCoords?.lat || null, userCoords?.lng || null);
      }
    } catch (err) {
      console.error("Accept error", err);
      alert("Something went wrong");
    } finally {
      setAcceptingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterBlood && r.bloodGroup !== filterBlood) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>📍 Nearby Blood Requests</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Emergency requests within <strong className="text-red-600 font-semibold">{filterRadius} km</strong> radius of your current position.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={filterBlood}
            onChange={(e) => setFilterBlood(e.target.value)}
            className="rounded-lg border border-gray-300 text-xs px-3 py-2 bg-white focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                Group {bg}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchNearbyRequests(userCoords?.lat || null, userCoords?.lng || null)}
            className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg border border-red-200 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 font-medium">Scanning nearby requests within 50 km...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredRequests.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
          <div className="text-4xl">💚</div>
          <h3 className="text-lg font-bold text-gray-800">No Pending Emergency Requests Nearby</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Great news! There are currently no active blood emergency requests within your area.
          </p>
        </div>
      )}

      {/* Requests Grid */}
      {!loading && filteredRequests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition space-y-4 ${
                r.status === "ARRANGED" ? "border-emerald-200 bg-emerald-50/30" : "border-red-100"
              }`}
            >
              {/* Header Badge Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black bg-red-600 text-white px-3 py-1 rounded-xl shadow-sm">
                    {r.bloodGroup}
                  </span>
                  <span className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-lg">
                    {r.unitsNeeded} {r.unitsNeeded === 1 ? "Unit" : "Units"} Needed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {r.distanceKm !== undefined && (
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200">
                      📍 {r.distanceKm} km away
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      r.status === "ARRANGED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 animate-pulse"
                    }`}
                  >
                    {r.status === "ARRANGED" ? "✓ ARRANGED" : "🚨 PENDING"}
                  </span>
                </div>
              </div>

              {/* Patient & Hospital Info */}
              <div>
                <h3 className="text-base font-bold text-gray-900">{r.patientName}</h3>
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <span>🏥 Hospital:</span>
                  <span className="font-semibold text-gray-800">{r.hospitalName}</span>
                </p>
                {r.address && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    📍 {r.address}
                  </p>
                )}
              </div>

              {/* Contact & Status details */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                <div>
                  <span className="block font-medium">Contact Phone:</span>
                  <a href={`tel:${r.contactNumber}`} className="font-bold text-red-600 hover:underline">
                    📞 {r.contactNumber}
                  </a>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-400">Requested:</span>
                  <span className="block font-medium text-gray-600">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {r.status === "PENDING" ? (
                <button
                  onClick={() => handleAcceptRequest(r.id)}
                  disabled={acceptingId === r.id}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{acceptingId === r.id ? "Processing..." : "❤️ I Will Donate / Accept Request"}</span>
                </button>
              ) : (
                <div className="w-full bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs text-center flex items-center justify-center gap-1">
                  <span>✅ Donor Assigned & Marked as Arranged</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
