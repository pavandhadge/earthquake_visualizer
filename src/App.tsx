// App.tsx
import { Routes, Route } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext";
import { NotesPanel } from "./components/NotesPanel";
import { HomePage } from "./components/HomePage";
import MapComponent from "./components/MapComponent";
// import { BrowserRouter } from "react-router-dom";
import { SideBar } from "./components/SideBar";
import { Header } from "./components/Header";
import useEarthQuakeData from "./components/dataRequest";
// import sqliteManager from "./db/sqliteManager";
import { NotesDashboard } from "./components/NotesDashboard";
import { useEffect, useState, useMemo } from "react";

/**
 * MapView component is the primary view for the earthquake map.
 * It manages the state for filters and orchestrates the data flow
 * from the data-fetching hook to the map and sidebar components.
 */
function MapView() {
  // Custom hook to fetch earthquake data from the USGS API.
  const { data, loading, error } = useEarthQuakeData(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  );

  // State for the currently selected earthquake on the map.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Temporary state for filter controls. These are applied to the main state via onApply.
  const [tMinMag, setTMinMag] = useState(0);
  const [tMaxMag, setTMaxMag] = useState(10);
  const [tMinDepth, setTMinDepth] = useState(-100);
  const [tMaxDepth, setTMaxDepth] = useState(1000);

  // Main state for active filters.
  const [minMag, setMinMag] = useState(0);
  const [maxMag, setMaxMag] = useState(10);
  const [minDepth, setMinDepth] = useState(-100);
  const [maxDepth, setMaxDepth] = useState(1000);

  /**
   * Applies the temporary filter values to the main filter state,
   * which triggers a re-render of the filtered data.
   */
  const apply = () => {
    setMinMag(tMinMag);
    setMaxMag(tMaxMag);
    setMinDepth(tMinDepth);
    setMaxDepth(tMaxDepth);
  };

  /**
   * Resets both temporary and main filter states to their default values.
   */
  const reset = () => {
    setTMinMag(0);
    setTMaxMag(10);
    setTMinDepth(-100);
    setTMaxDepth(1000);
    // Also apply the reset values immediately
    setMinMag(0);
    setMaxMag(10);
    setMinDepth(-100);
    setMaxDepth(1000);
  };

  /**
   * Processes the raw data by filtering and sorting.
   * useMemo ensures this expensive operation only runs when dependencies change.
   */
  const processed = useMemo(() => {
    if (!data) return null;
    const filtered = data.features.filter(
      (f) =>
        f.properties.mag !== null &&
        f.properties.mag >= minMag &&
        f.properties.mag <= maxMag &&
        f.geometry.coordinates[2] >= minDepth &&
        f.geometry.coordinates[2] <= maxDepth,
    );
    return {
      ...data,
      // Sort by magnitude descending and take the top 100 to keep the map performant.
      features: filtered
        .sort((a, b) => (b.properties.mag ?? 0) - (a.properties.mag ?? 0))
        .slice(0, 100),
    };
  }, [data, minMag, maxMag, minDepth, maxDepth]);

  // Render loading/error states or the main map view.
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-600 text-center">Error: {error}</div>;
  if (!processed) return null;

  return (
    <div className="flex size-full overflow-hidden font-sans">
      <SideBar
        data={processed} // Pass filtered data to sidebar and map
        rawData={data!} // Pass raw data for downloads
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        // Pass both temp state and setters for controlled inputs
        tMinMag={tMinMag}
        setTMinMag={setTMinMag}
        tMaxMag={tMaxMag}
        setTMaxMag={setTMaxMag}
        tMinDepth={tMinDepth}
        setTMinDepth={setTMinDepth}
        tMaxDepth={tMaxDepth}
        setTMaxDepth={setTMaxDepth}
        onApply={apply}
        onReset={reset}
      />
      <main className="flex-1 relative">
        <MapComponent data={processed} selectedId={selectedId} />
        <NotesPanel />
      </main>
    </div>
  );
}

/**
 * The root component of the application.
 * It sets up the main layout, context providers, and routing.
 */
export default function App() {
  return (
    // NotesProvider makes the notes state available throughout the app.
    <NotesProvider>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/notes" element={<NotesDashboard />} />
        </Routes>
      </div>
    </NotesProvider>
  );
}
