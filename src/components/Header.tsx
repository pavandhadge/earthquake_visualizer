// src/components/Header.tsx
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/map", label: "Map" },
    { path: "/notes", label: "Notes" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-80 transition-opacity"
          >
            Earthquake Visualizer
          </Link>

          {/* Center Nav */}
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded-full">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    location.pathname === item.path
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Side: Badge */}
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
              Local Storage
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
