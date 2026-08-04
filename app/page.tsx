import Link from 'next/link';

export default function Page() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-red-600 to-red-800 overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Blood drop shape (large, subtle) */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative max-w-4xl w-full text-center z-10">
        {/* Brand name with drop icon */}
        <div className="flex items-center justify-center gap-3 mb-4">
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight">
            Zarkhoon
          </h1>
        </div>

        {/* Hero headline */}
        <p className="text-2xl sm:text-3xl md:text-4xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
          Every drop has the power to save a life.
        </p>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mt-4 mb-8">
          Join Zarkhoon today and become a hero. Your donation can make a world of difference.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 bg-white text-red-700 font-semibold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <span>Sign Up</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <Link
            href="/signin"
            className="group inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-white hover:text-red-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            <span>Sign In</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </Link>
        </div>

        {/* Trust indicator */}
        <p className="text-sm text-white/100 mt-8">
          Every 2 seconds someone needs blood. Be the reason.
        </p>
      </div>
    </main>
  );
}