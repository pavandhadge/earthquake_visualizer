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
    <header className="bg-white/90 backdrop-blur-sm shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600"
        >
          Earthquake Visualizer
        </Link>

        {/* Right Side: Nav + Badge */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Local Storage Badge */}
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            Local Storage
          </span>
        </div>
      </div>
    </header>
  );
}
