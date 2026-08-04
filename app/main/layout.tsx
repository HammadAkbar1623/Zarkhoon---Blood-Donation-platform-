"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error("Auth check error", e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error("Notification check error", e);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchNotifications();

    // Poll notifications every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    router.push("/signin");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2">
              <Link href="/main/feed" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  🩸
                </div>
                <span className="text-xl font-bold text-red-700 tracking-tight">Zarkhoon</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/main/feed"
                className={`text-sm font-medium transition-colors ${
                  isActive("/main/feed") ? "text-red-600 font-semibold" : "text-gray-600 hover:text-red-600"
                }`}
              >
                Home
              </Link>
              <Link
                href="/main/RequestBlood"
                className={`text-sm font-medium transition-colors ${
                  isActive("/main/RequestBlood") ? "text-red-600 font-semibold" : "text-gray-600 hover:text-red-600"
                }`}
              >
                Request Blood
              </Link>
              <Link
                href="/main/NearbyRequest"
                className={`text-sm font-medium transition-colors ${
                  isActive("/main/NearbyRequest") ? "text-red-600 font-semibold" : "text-gray-600 hover:text-red-600"
                }`}
              >
                Nearby Requests
              </Link>
              <Link
                href="/main/Notifications"
                className={`relative text-sm font-medium transition-colors ${
                  isActive("/main/Notifications") ? "text-red-600 font-semibold" : "text-gray-600 hover:text-red-600"
                }`}
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-3 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/main/Profile"
                className={`text-sm font-medium transition-colors ${
                  isActive("/main/Profile") ? "text-red-600 font-semibold" : "text-gray-600 hover:text-red-600"
                }`}
              >
                Profile {user?.bloodGroup && <span className="ml-1 text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">{user.bloodGroup}</span>}
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-300 hover:border-red-600 px-3 py-1.5 rounded-lg transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-3">
              <Link
                href="/main/Notifications"
                className="relative p-1 text-gray-700 hover:text-red-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-800 hover:text-red-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 flex flex-col space-y-3">
              <Link
                href="/main/feed"
                onClick={() => setIsMenuOpen(false)}
                className={`px-2 py-1 text-sm font-medium ${isActive("/main/feed") ? "text-red-600 font-bold" : "text-gray-700"}`}
              >
                Home
              </Link>
              <Link
                href="/main/RequestBlood"
                onClick={() => setIsMenuOpen(false)}
                className={`px-2 py-1 text-sm font-medium ${isActive("/main/RequestBlood") ? "text-red-600 font-bold" : "text-gray-700"}`}
              >
                Request Blood
              </Link>
              <Link
                href="/main/NearbyRequest"
                onClick={() => setIsMenuOpen(false)}
                className={`px-2 py-1 text-sm font-medium ${isActive("/main/NearbyRequest") ? "text-red-600 font-bold" : "text-gray-700"}`}
              >
                Nearby Requests
              </Link>
              <Link
                href="/main/Notifications"
                onClick={() => setIsMenuOpen(false)}
                className={`px-2 py-1 text-sm font-medium ${isActive("/main/Notifications") ? "text-red-600 font-bold" : "text-gray-700"}`}
              >
                Notifications ({unreadCount})
              </Link>
              <Link
                href="/main/Profile"
                onClick={() => setIsMenuOpen(false)}
                className={`px-2 py-1 text-sm font-medium ${isActive("/main/Profile") ? "text-red-600 font-bold" : "text-gray-700"}`}
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-left px-2 py-1 text-sm font-medium text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}