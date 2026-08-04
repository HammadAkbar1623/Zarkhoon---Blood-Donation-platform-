"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = {
    left: [
      { name: "Request Blood", href: "/main/RequestBlood" },
      { name: "Nearby Requests", href: "/main/NearbyRequest" },
    ],
    center: [{ name: "Home", href: "/main/feed" }],
    right: [
      { name: "Notifications", href: "/main/Notifications" },
      { name: "Profile", href: "/main/Profile" },
    ],
  };

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop navigation – 3‑column grid for perfect centering */}
        <div className="hidden md:grid grid-cols-3 items-center h-16">
          {/* Left section */}
          <div className="flex justify-start space-x-16">
            {navItems.left.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-800 hover:text-red-600 transition-colors ${
                  isActive(item.href) ? "text-red-600 font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Center section */}
          <div className="flex justify-center">
            {navItems.center.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-800 hover:text-red-600 transition-colors ${
                  isActive(item.href) ? "text-red-600 font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex justify-end space-x-16">
            {navItems.right.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-800 hover:text-red-600 transition-colors ${
                  isActive(item.href) ? "text-red-600 font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex md:hidden justify-between items-center h-16">
          <div className="flex-1">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 hover:text-red-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Center: Home (optional on mobile) */}
            <Link
              href="/"
              className={`text-gray-800 hover:text-red-600 transition-colors ${
                isActive("/") ? "text-red-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            {/* Placeholder to balance layout */}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {/* Left section mobile */}
              {navItems.left.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-800 hover:text-red-600 transition-colors ${
                    isActive(item.href) ? "text-red-600 font-semibold" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Right section mobile (Notifications, Profile) */}
              {navItems.right.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-800 hover:text-red-600 transition-colors ${
                    isActive(item.href) ? "text-red-600 font-semibold" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}