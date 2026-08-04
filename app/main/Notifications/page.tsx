"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Fetch notifications error", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id?: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { notificationId: id } : { markAllRead: true }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🔔 Real-Time Notifications</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Emergency alerts matching your blood type within 50 km.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={() => markAsRead()}
            className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 font-medium">Fetching notifications...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
          <div className="text-4xl">🔕</div>
          <h3 className="text-lg font-bold text-gray-800">No Notifications Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            You will receive alerts here when emergency blood requests are posted near your location.
          </p>
        </div>
      )}

      {/* List */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                !n.isRead
                  ? "bg-red-50/60 border-red-200 shadow-sm"
                  : "bg-white border-gray-200 opacity-80"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{n.title}</span>
                  {!n.isRead && (
                    <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{n.message}</p>
                <p className="text-[11px] text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {n.requestId && (
                  <Link
                    href="/main/NearbyRequest"
                    className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition shadow-sm"
                  >
                    View Request
                  </Link>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-[11px] text-gray-500 hover:text-red-600 underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
