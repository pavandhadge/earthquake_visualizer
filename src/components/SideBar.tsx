// src/components/SideBar.tsx
import type { EarthquakeGeoJson } from "../EarthquakeTypes";
import { useNotes } from "../context/NotesContext";

// --- SVG Icons ---
const DownloadIcon = () => (
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
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);
const NotesIcon = () => (
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
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z"
    />
  </svg>
);
const FilterIcon = () => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);
const ListIcon = () => (
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
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);
const ChevronLeftIcon = () => (
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
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const ChevronRightIcon = () => (
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
      d="M9 5l7 7-7 7"
    />
  </svg>
);

function FilterInput({ label, value, setValue, placeholder }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        className="w-full p-2 mt-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

interface Props {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
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
  const {
    isCollapsed,
    setIsCollapsed,
    data,
    rawData,
    selectedId,
    setSelectedId,
    onApply,
    onReset,
  } = props;
  const quakes = data.features;
  const { open: openNotes } = useNotes();

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      `"${f.id}"`,
      `"${(f.properties.title || "").replace(/"/g, '""')}"`,
      f.properties.mag,
      f.geometry.coordinates[2],
      new Date(f.properties.time).toISOString(),
      f.properties.tsunami,
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

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-96"}`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Expanded Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${isCollapsed ? "hidden" : ""}`}
        >
          <h2 className="font-bold text-gray-800">Controls</h2>
        </div>

        {/* Collapsed Header */}
        <div
          className={`p-4 border-b flex items-center justify-center ${isCollapsed ? "" : "hidden"}`}
        >
          <FilterIcon />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
          {/* Filters */}
          <section>
            <h3
              className={`font-bold text-gray-800 mb-4 ${isCollapsed ? "hidden" : ""}`}
            >
              Filters
            </h3>
            <div className={isCollapsed ? "hidden" : "space-y-4"}>
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
                  Apply
                </button>
                <button
                  onClick={onReset}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section>
            <h3
              className={`font-bold text-gray-800 mb-3 ${isCollapsed ? "hidden" : ""}`}
            >
              Actions
            </h3>
            <div
              className={`grid grid-cols-1 gap-2 ${isCollapsed ? "hidden" : ""}`}
            >
              <button
                onClick={openNotes}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                {" "}
                <NotesIcon /> <span>Notes</span>
              </button>
              <button
                onClick={downloadCSV}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                <DownloadIcon />
                <span>CSV</span>
              </button>
              <button
                onClick={downloadGeoJSON}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                <DownloadIcon />
                <span>GeoJSON</span>
              </button>
            </div>
            <div className={`space-y-3 ${isCollapsed ? "" : "hidden"}`}>
              <button
                onClick={openNotes}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg"
              >
                <NotesIcon />
              </button>
              <button
                onClick={downloadCSV}
                className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg"
              >
                <DownloadIcon />
              </button>
            </div>
          </section>

          {/* List */}
          <section className="flex-1 flex flex-col min-h-0">
            <div
              className={`flex justify-between items-center mb-2 ${isCollapsed ? "hidden" : ""}`}
            >
              <h3 className="font-bold text-gray-800">Earthquakes</h3>
              <p className="text-sm font-medium text-gray-500">
                {quakes.length} results
              </p>
            </div>
            <div
              className={`flex justify-center mb-2 ${isCollapsed ? "" : "hidden"}`}
            >
              <ListIcon />
            </div>
            <div
              className={`flex-1 overflow-y-auto space-y-2 ${isCollapsed ? "hidden" : ""}`}
            >
              {quakes.map((eq) => {
                const p = eq.properties;
                const isSel = eq.id === selectedId;
                return (
                  <div
                    key={eq.id}
                    onClick={() => setSelectedId(isSel ? null : eq.id)}
                    className={`p-3 rounded-lg cursor-pointer border-2 ${isSel ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200 hover:border-blue-400"}`}
                  >
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {p.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      M {p.mag?.toFixed(1)} • {eq.geometry.coordinates[2]} km
                      depth
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer Toggle */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-md"
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
      </div>
    </aside>
  );
}
