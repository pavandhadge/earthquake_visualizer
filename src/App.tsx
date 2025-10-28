import { useState } from "react";
import "./App.css";
import MapComponent from "./components/MapComponent";
import useEarthQuakeData from "./components/dataRequest";
import { SideBar } from "./components/SideBar";

function App() {
  const { data, loading, error } = useEarthQuakeData(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  );
  const [selectedQuakeId, setSelectedQuakeId] = useState<string | null>(null);
  const [minMagnitude, setMinMagnitude] = useState<number>(0);
  const [maxMagnitude, setMaxMagnitude] = useState<number>(10);
  const [minDepth, setMinDepth] = useState<number>(-100);
  const [maxDepth, setMaxDepth] = useState<number>(1000);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const filteredData = {
    ...data,
    features: data.features.filter(
      (feature) =>
        feature.properties.mag !== null &&
        feature.properties.mag >= minMagnitude &&
        feature.properties.mag <= maxMagnitude &&
        feature.geometry.coordinates[2] >= minDepth &&
        feature.geometry.coordinates[2] <= maxDepth,
    ),
  };

  return (
    <>
      <div className="flex h-screen w-screen">
        <div className="h-full w-1/5 overflow-y-auto">
          <SideBar
            data={filteredData}
            selectedQuakeId={selectedQuakeId}
            setSelectedQuakeId={setSelectedQuakeId}
            minMagnitude={minMagnitude}
            setMinMagnitude={setMinMagnitude}
            maxMagnitude={maxMagnitude}
            setMaxMagnitude={setMaxMagnitude}
            minDepth={minDepth}
            setMinDepth={setMinDepth}
            maxDepth={maxDepth}
            setMaxDepth={setMaxDepth}
          />
        </div>
        <div className="h-full w-4/5 overflow-hidden">
          <MapComponent data={filteredData} selectedQuakeId={selectedQuakeId} />
        </div>
      </div>
    </>
  );
}

export default App;
