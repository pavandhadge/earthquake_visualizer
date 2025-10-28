import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MapComponent from "./components/MapComponent";
import useEarthQuakeData from "./components/dataRequest";

function App() {
  const { data, loading, error } = useEarthQuakeData(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <>
      {/*<div>
        <MapComponent />
      </div>*/}
    </>
  );
}

export default App;
