// src/components/SideBar.tsx

import type { EarthquakeGeoJson } from "../EarthquakeTypes";
import { useNotes } from "../context/NotesContext";

// --- SVG Icons for UI buttons ---
const DownloadIcon = () => (
  <svg
    className="w-4 h-4"
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
const NotesIcon = () => (
  <svg
    className="w-4 h-4"
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

/**
 * A reusable number input component for filtering.
 */
function FilterInput({ label, value, setValue, placeholder }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        className="w-full p-2 mt-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

interface Props {
  data: EarthquakeGeoJson; // Filtered data for display
  rawData: EarthquakeGeoJson; // Complete, unfiltered data for downloads
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  // Temporary state for filter inputs
  tMinMag: number;
  setTMinMag: (v: number) => void;
  tMaxMag: number;
  setTMaxMag: (v: number) => void;
  tMinDepth: number;
  setTMinDepth: (v: number) => void;
  tMaxDepth: number;
  setTMaxDepth: (v: number) => void;
  onApply: () => void; // Applies the temporary filters
  onReset: () => void; // Resets filters to default
}

/**
 * The main sidebar component that houses filters, actions, and the list of earthquakes.
 */
export function SideBar(props: Props) {
  const { data, rawData, selectedId, setSelectedId, onApply, onReset } = props;
  const quakes = data.features;
  const { open: openNotes } = useNotes(); // Context hook to open the notes panel

  /**
   * A generic utility to trigger a file download in the browser.
   */
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Formats the raw earthquake data into a CSV string and triggers a download.
   */
  const downloadCSV = () => {
    const headers = [
      "ID",
      "Title",
      "Magnitude",
      "Depth",
      "Time",
      "Tsunami",
      "URL",
    ];
    const rows = rawData.features.map((f) => [
      f.id,
      `"${(f.properties.title || "").replace(/"/g, '""')}"`,
      f.properties.mag,
      f.geometry.coordinates[2],
      new Date(f.properties.time).toISOString(),
      f.properties.tsunami ? "Yes" : "No",
      f.properties.url,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    downloadFile(csv, "earthquakes.csv", "text/csv");
  };

  /**
   * Converts the raw earthquake data into a JSON string and triggers a download.
   */
  const downloadGeoJSON = () => {
    downloadFile(
      JSON.stringify(rawData, null, 2),
      "earthquakes.geojson",
      "application/json",
    );
  };

  return (
    <aside className="w-96 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Filter Section */}
      <section className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-800 mb-4">Filters</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FilterInput
              label="Min Mag"
              value={props.tMinMag}
              setValue={props.setTMinMag}
              placeholder="0"
            />
            <FilterInput
              label="Max Mag"
              value={props.tMaxMag}
              setValue={props.setTMaxMag}
              placeholder="10"
            />
            <FilterInput
              label="Min Depth"
              value={props.tMinDepth}
              setValue={props.setTMinDepth}
              placeholder="-100"
            />
            <FilterInput
              label="Max Depth"
              value={props.tMaxDepth}
              setValue={props.setTMaxDepth}
              placeholder="1000"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onApply}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={onReset}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Actions & Downloads Section */}
      <section className="p-4 border-b border-gray-200">
        <button
          onClick={openNotes}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          <NotesIcon />
          <span>Open Notes</span>
        </button>
      </section>
      <section className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-800 mb-3">Download Data</h2>
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={downloadCSV}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <DownloadIcon />
              <span>CSV</span>
            </button>
            <button
              onClick={downloadGeoJSON}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <DownloadIcon />
              <span>GeoJSON</span>
            </button>
          </div>
        </div>
      </section>

      {/* Earthquake List Section */}
      <section className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Latest Earthquakes</h3>
          <p className="text-sm font-medium text-gray-500">
            {quakes.length} results
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {quakes.map((eq) => {
            const p = eq.properties;
            const isSel = eq.id === selectedId;
            return (
              <div
                key={eq.id}
                onClick={() => setSelectedId(isSel ? null : eq.id)}
                className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${isSel ? "bg-blue-50 border-blue-500 shadow-sm" : "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50"}`}
              >
                <div className="font-semibold text-sm text-gray-900 truncate">
                  {p.title}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  M {p.mag?.toFixed(1)} • {eq.geometry.coordinates[2]} km depth
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
