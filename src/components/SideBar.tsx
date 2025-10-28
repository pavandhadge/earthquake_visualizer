import type { EarthquakeFeature, EarthquakeGeoJson } from "../EarthquakeTypes";

interface SideBarProps {
  data: EarthquakeGeoJson;
  selectedQuakeId: string | null;
  setSelectedQuakeId: (id: string | null) => void;
  minMagnitude: number;
  setMinMagnitude: (value: number) => void;
  maxMagnitude: number;
  setMaxMagnitude: (value: number) => void;
  minDepth: number;
  setMinDepth: (value: number) => void;
  maxDepth: number;
  setMaxDepth: (value: number) => void;
}

export const SideBar = ({
  data,
  selectedQuakeId,
  setSelectedQuakeId,
  minMagnitude,
  setMinMagnitude,
  maxMagnitude,
  setMaxMagnitude,
  minDepth,
  setMinDepth,
  maxDepth,
  setMaxDepth,
}: SideBarProps) => {
  // Optional: sort by magnitude descending
  const sorted = [...data.features].sort(
    (a, b) => (b.properties.mag ?? 0) - (a.properties.mag ?? 0),
  );

  return (
    <aside className="sidebar bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">USGS Earthquakes (last 24 h)</h1>
      <p className="mb-4">
        <strong>{data.features.length}</strong> events shown
      </p>

      <div className="mb-4">
        <label
          htmlFor="min-magnitude-filter"
          className="block text-sm font-medium text-gray-700"
        >
          Min Magnitude: {minMagnitude.toFixed(1)}
        </label>
        <input
          type="range"
          id="min-magnitude-filter"
          min="0"
          max="10"
          step="0.1"
          value={minMagnitude}
          onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="max-magnitude-filter"
          className="block text-sm font-medium text-gray-700"
        >
          Max Magnitude: {maxMagnitude.toFixed(1)}
        </label>
        <input
          type="range"
          id="max-magnitude-filter"
          min="0"
          max="10"
          step="0.1"
          value={maxMagnitude}
          onChange={(e) => setMaxMagnitude(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="min-depth-filter"
          className="block text-sm font-medium text-gray-700"
        >
          Min Depth: {minDepth.toFixed(1)} km
        </label>
        <input
          type="range"
          id="min-depth-filter"
          min="-100"
          max="1000"
          step="10"
          value={minDepth}
          onChange={(e) => setMinDepth(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="max-depth-filter"
          className="block text-sm font-medium text-gray-700"
        >
          Max Depth: {maxDepth.toFixed(1)} km
        </label>
        <input
          type="range"
          id="max-depth-filter"
          min="-100"
          max="1000"
          step="10"
          value={maxDepth}
          onChange={(e) => setMaxDepth(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <ul>
        {sorted.map((eq: EarthquakeFeature) => {
          const { mag, place, time, title } = eq.properties;
          const isSelected = eq.id === selectedQuakeId;

          return (
            <li
              key={eq.id}
              className={`quake-item p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? "bg-blue-200 shadow-md"
                  : "bg-white hover:bg-blue-50"
              }`}
              onClick={() => setSelectedQuakeId(isSelected ? null : eq.id)}
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-gray-700">
                <strong>Magnitude:</strong> {mag ?? "—"}
                <br />
                <strong>Location:</strong> {place ?? "—"}
                <br />
                <strong>Time:</strong>{" "}
                {new Date(time).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                <br />
                <strong>Depth:</strong> {eq.geometry.coordinates[2]} km
              </p>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
