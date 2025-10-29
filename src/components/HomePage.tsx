// src/components/HomePage.tsx
import { Link } from "react-router-dom";

// --- SVG Icons ---
const GlobeIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9"
    />
  </svg>
);
const MapIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-.553-.894L15 2m-6 5l6-3m0 13V5"
    />
  </svg>
);
const PenIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z"
    />
  </svg>
);
const DownloadIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const features = [
  {
    icon: <GlobeIcon />,
    title: "Live USGS Data",
    desc: "Real-time earthquake updates from the source.",
  },
  {
    icon: <MapIcon />,
    title: "Interactive Map",
    desc: "Zoom, pan, and click to explore seismic events.",
  },
  {
    icon: <PenIcon />,
    title: "Local Notes",
    desc: "Save observations and thoughts directly in your browser.",
  },
  {
    icon: <DownloadIcon />,
    title: "Export Data",
    desc: "Download raw data in CSV or GeoJSON format.",
  },
];

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-68px)] bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4 tracking-tight">
          Earthquake Visualizer
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Explore real-time USGS seismic data with an interactive map and local
          note-taking. Built for students, researchers, and the curious.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full my-16">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow hover:-translate-y-1 transform"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 text-blue-600 rounded-xl flex items-center justify-center mb-5">
              {f.icon}
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          to="/map"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
        >
          Launch Interactive Map
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
