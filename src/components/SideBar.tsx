// src/components/SideBar.tsx
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
  const { open: openNotes } = useNotes();

  // Download functions
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
    <aside className="w-80 bg-gradient-to-b from-blue-50 to-white flex flex-col h-screen">
      {/* Filters - Compact */}
      <section className="p-4 bg-white border-b border-gray-200">
        <h2 className="font-semibold text-sm mb-3">Filters</h2>
        <div className="space-y-3">
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
          <div className="flex gap-1.5">
            <button
              onClick={onApply}
              className="flex-1 bg-blue-600 text-white py-1.5 rounded text-xs font-medium"
            >
              Apply
            </button>
            <button
              onClick={onReset}
              className="flex-1 bg-gray-200 py-1.5 rounded text-xs font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Download Buttons - Super Compact */}
      <div className="px-4 py-2 bg-green-50 border-b border-gray-200 flex gap-2">
        <button
          onClick={downloadCSV}
          className="flex-1 bg-green-600 text-white py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"
          title="Download CSV"
        >
          <span>CSV</span>
        </button>
        <button
          onClick={downloadGeoJSON}
          className="flex-1 bg-green-600 text-white py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"
          title="Download GeoJSON"
        >
          <span>GeoJSON</span>
        </button>
      </div>

      {/* Earthquake List - Takes Remaining Height */}
      <section className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 pt-3 pb-2 flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-700">
            {quakes.length} events
          </p>
          <button
            onClick={openNotes}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
          >
            Open Notes
          </button>
        </div>

        {/* List - Hidden Overflow, No Scroll */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 pb-4 space-y-1.5">
            {quakes.map((eq) => {
              const p = eq.properties;
              const isSel = eq.id === selectedId;
              return (
                <div
                  key={eq.id}
                  onClick={() => setSelectedId(isSel ? null : eq.id)}
                  className={`p-2 rounded cursor-pointer text-xs border transition-all ${
                    isSel
                      ? "bg-blue-100 border-blue-500 shadow-sm"
                      : "bg-gray-50 hover:bg-gray-100 border-transparent"
                  }`}
                >
                  <div className="font-medium text-gray-900 truncate">
                    {p.title}
                  </div>
                  <div className="text-gray-600 text-xs">
                    M{p.mag?.toFixed(1)} • {eq.geometry.coordinates[2]} km
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </aside>
  );
}

// Compact Slider
function FilterSlider({ label, min, max, step, ...p }: any) {
  const field = p.field;
  const value = p[field];
  const setValue = p[`set${field.replace("t", "T")}`];
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium flex justify-between">
        <span>{label}</span>
        <span className="text-blue-600 font-mono">
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
        className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer accent-blue-600"
      />
    </div>
  );
}
