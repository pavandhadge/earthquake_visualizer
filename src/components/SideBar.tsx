// components/SideBar.tsx
import { useState, useEffect } from "react";
import type { EarthquakeGeoJson } from "../EarthquakeTypes";
import { useNotes } from "../context/NotesContext";
interface Props {
  data: EarthquakeGeoJson;
  rawData: EarthquakeGeoJson;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  tMinMag: number;
  setTMinMag: (v: number) => void;
  tMaxMag: number;
  setTMaxMag: (v: number) => void;
  tMinDepth: number;
  setTMinDepth: (v: number) => void;
  tMaxDepth: number;
  setTMaxDepth: (v: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export function SideBar(props: Props) {
  const { data, rawData, selectedId, setSelectedId, onApply, onReset } = props;
  const quakes = data.features;

  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const { open: openNotes } = useNotes();
  // Load notes
  useEffect(() => {
    const saved = localStorage.getItem("earthquake-notes");
    if (saved) setNotes(saved);
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem("earthquake-notes", notes);
  }, [notes]);

  // Download notes
  const downloadNotes = () => {
    const blob = new Blob([notes || "No notes yet."], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download data
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

  const downloadGeoJSON = () => {
    downloadFile(
      JSON.stringify(rawData, null, 2),
      "earthquakes.geojson",
      "application/json",
    );
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Sidebar - Scrolls Inside */}
      <aside className="w-80 bg-gradient-to-b from-blue-50 to-white flex flex-col h-full">
        <header className="p-4 border-b bg-white">
          <h1 className="text-lg font-bold text-blue-900">
            Earthquake Visualizer
          </h1>
          <p className="text-xs text-gray-600">Last 24h • USGS</p>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Filters */}
          <section className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3 text-sm">Filters</h2>
            <FilterSlider
              label="Min Mag"
              min={0}
              max={10}
              step={0.1}
              {...props}
              field="tMinMag"
            />
            <FilterSlider
              label="Max Mag"
              min={0}
              max={10}
              step={0.1}
              {...props}
              field="tMaxMag"
            />
            <FilterSlider
              label="Min Depth"
              min={-100}
              max={1000}
              step={10}
              {...props}
              field="tMinDepth"
            />
            <FilterSlider
              label="Max Depth"
              min={-100}
              max={1000}
              step={10}
              {...props}
              field="tMaxDepth"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={onApply}
                className="flex-1 bg-blue-600 text-white py-2 rounded text-sm"
              >
                Apply
              </button>
              <button
                onClick={onReset}
                className="flex-1 bg-gray-200 py-2 rounded text-sm"
              >
                Reset
              </button>
            </div>
          </section>

          {/* Download */}
          <section className="bg-green-50 p-3 rounded-xl">
            <h3 className="font-medium text-sm mb-2">Download Data</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={downloadCSV}
                className="bg-green-600 text-white py-2 rounded text-xs"
              >
                CSV
              </button>
              <button
                onClick={downloadGeoJSON}
                className="bg-green-600 text-white py-2 rounded text-xs"
              >
                GeoJSON
              </button>
            </div>
          </section>

          {/* Earthquake List */}
          <section>
            {/*// components/SideBar.tsx (only the button part)*/}
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">{quakes.length} events</p>
              <button
                onClick={openNotes}
                className="text-xs text-blue-600 underline hover:text-blue-800"
              >
                Open Notes
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {quakes.map((eq) => {
                const p = eq.properties;
                const isSel = eq.id === selectedId;
                return (
                  <div
                    key={eq.id}
                    onClick={() => setSelectedId(isSel ? null : eq.id)}
                    className={`p-2 rounded cursor-pointer text-xs border transition ${
                      isSel
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-medium">{p.title}</div>
                    <div className="text-gray-600">
                      M{p.mag?.toFixed(1)} • {eq.geometry.coordinates[2]} km
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </aside>

      {/* GMAIL-STYLE FLOATING NOTES PANEL */}
      {showNotes && (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-xl shadow-2xl border flex flex-col z-500 animate-in slide-in-from-bottom">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-blue-50 rounded-t-xl">
            <h3 className="font-semibold text-blue-900">Research Notes</h3>
            <div className="flex gap-1">
              <button
                onClick={downloadNotes}
                className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                title="Download"
              >
                Download
              </button>
              <button
                onClick={() => setShowNotes(false)}
                className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                title="Close"
              >
                Close
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Jot down patterns, hypotheses, or observations..."
            className="flex-1 p-3 text-sm resize-none focus:outline-none"
          />

          {/* Footer */}
          <div className="p-2 border-t bg-gray-50 rounded-b-xl text-right">
            <span className="text-xs text-gray-500">
              {notes.length} characters
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// Reusable slider
function FilterSlider({ label, min, max, step, ...p }: any) {
  const field = p.field;
  const value = p[field];
  const setValue = p[`set${field.replace("t", "T")}`];
  return (
    <div className="mb-3">
      <label className="text-xs font-medium block">
        {label}:{" "}
        <span className="text-blue-600">
          {value % 1 === 0 ? value : value.toFixed(1)}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-600"
      />
    </div>
  );
}
