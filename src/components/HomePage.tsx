// src/components/HomePage.tsx
import { Link } from "react-router-dom";
import { Header } from "./Header";
import { NotesDashboard } from "./NotesDashboard";
import { useState } from "react";

export function HomePage() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <NotesDashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <>
      {/*<Header />*/}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-6xl w-full text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 mb-6">
            Earthquake Visualizer
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Explore real-time USGS seismic data with interactive maps and local
            note-taking.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full mb-16">
          {[
            {
              icon: "Globe",
              title: "Live USGS Data",
              desc: "Real-time earthquake updates",
            },
            {
              icon: "Map",
              title: "Interactive Map",
              desc: "Zoom, filter, explore",
            },
            {
              icon: "Pen",
              title: "Local Notes",
              desc: "Save observations offline",
            },
            {
              icon: "Download",
              title: "Export Data",
              desc: "JSON export anytime",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">{f.icon}</span>
              </div>
              <h3 className="font-bold text-lg text-blue-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="max-w-md w-full">
          <Link
            to="/notes"
            className="block bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">Notes</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                View Saved Notes
              </h3>
              <p className="text-gray-600 mb-4">
                All notes stored locally in your browser
              </p>
              <span className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium inline-block hover:bg-blue-700 transition">
                Open Notes
              </span>
            </div>
          </Link>
        </div>

        {/* Open Map Button */}
        <div className="mt-12">
          <Link
            to="/map"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all hover:scale-105"
          >
            <span>Launch Map</span>
          </Link>
        </div>
      </div>
    </>
  );
}
