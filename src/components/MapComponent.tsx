// components/MapComponent.tsx
import { useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  LayersControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { EarthquakeFeature, EarthquakeGeoJson } from "../EarthquakeTypes";

interface Props {
  data: EarthquakeGeoJson;
  selectedId: string | null;
}

// --- Helper Functions for Marker Styling and Formatting ---

/** Converts earthquake magnitude to a suitable radius for the circle marker. */
const magToRadius = (mag: number | null): number =>
  mag === null ? 6 : Math.max(4, mag * 2.5);

/** Determines the color of the circle marker based on magnitude. */
const getColor = (mag: number): string =>
  mag > 5 ? "#b30000" : mag > 3 ? "#ff8c00" : "#33cc33";

/** Formats a timestamp (in milliseconds) into a readable date and time string. */
const formatTime = (ms: number): string =>
  new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

/** Formats the magnitude value for display, showing one decimal place or '—' if null. */
const magDisplay = (m: number | null): string =>
  m === null ? "—" : m.toFixed(1);

/**
 * A helper component that automatically flies the map to the selected earthquake
 * and opens its popup. This keeps map view logic separate from the main component.
 */
const FlyToSelected = ({ selectedId, data }: Props) => {
  const map = useMap();
  const layerRef = useRef<L.CircleMarker | null>(null); // Ref to store the selected layer

  // Event handler to capture the layer when it's added to the map
  useMapEvents({
    layeradd(e) {
      const layer = e.layer as L.CircleMarker;
      // If the added layer matches the selected ID, store its reference.
      if ((layer as any).feature?.id === selectedId) {
        layerRef.current = layer;
      }
    },
  });

  // This effect runs when the selectedId changes.
  useMemo(() => {
    if (!selectedId) {
      layerRef.current?.closePopup(); // Close popup if selection is cleared
      layerRef.current = null;
      return;
    }

    const feature = data.features.find((f) => f.id === selectedId);
    if (!feature) return;

    const [lng, lat] = feature.geometry.coordinates;
    // Animate the map view to the selected earthquake's coordinates.
    map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
    // Open the popup for the selected earthquake.
    layerRef.current?.openPopup();
  }, [selectedId, data, map]);

  return null; // This component does not render anything itself.
};

/**
 * The main map component that displays the earthquake data.
 */
export const MapComponent = ({ data, selectedId }: Props) => {
  // Calculate the center of the map based on the average coordinates of the earthquakes.
  const center = useMemo(() => {
    const n = data.features.length;
    if (n === 0) return [20, 0] as [number, number]; // Default center if no data

    const sum = data.features.reduce(
      (acc, f) => {
        acc[0] += f.geometry.coordinates[1]; // lat
        acc[1] += f.geometry.coordinates[0]; // lng
        return acc;
      },
      [0, 0],
    );
    return [sum[0] / n, sum[1] / n] as [number, number];
  }, [data.features]);

  // Memoize the creation of markers to prevent re-rendering on every map interaction.
  const markers = useMemo(() => {
    // Render markers across multiple world copies for a seamless experience.
    const offsets: number[] = [-360, 0, 360];
    return offsets.flatMap((offset) =>
      data.features
        .filter((f) => f.properties.mag !== null)
        .map((eq) => {
          const [lng, lat] = eq.geometry.coordinates;
          const mag = eq.properties.mag!;
          const isSelected = eq.id === selectedId;

          return (
            <CircleMarker
              key={`${eq.id}-${offset}`}
              center={[lat, lng + offset]}
              radius={magToRadius(mag)}
              pathOptions={{
                fillColor: getColor(mag),
                fillOpacity: isSelected ? 0.95 : 0.7,
                color: isSelected ? "#0000ff" : "#000",
                weight: isSelected ? 3 : 1,
              }}
              eventHandlers={{
                // Bind the rich popup when the layer is added.
                add: (e) => {
                  const layer = e.target as L.CircleMarker;
                  (layer as any).feature = eq; // Attach feature data for later reference
                  layer.bindPopup(() => createPopup(eq));
                },
              }}
            />
          );
        }),
    );
  }, [data.features, selectedId]);

  return (
    <MapContainer
      center={center}
      zoom={3}
      scrollWheelZoom
      className="h-screen w-full"
      worldCopyJump // Ensures a smooth experience when panning across the date line
      minZoom={2}
      maxZoom={9}
    >
      {/* --- Base Map Layers --- */}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution="Esri World Imagery"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution='&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a>'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* --- Earthquake Data Layer --- */}
      <>{markers}</>

      {/* --- Helper component to handle map view changes --- */}
      <FlyToSelected selectedId={selectedId} data={data} />
    </MapContainer>
  );
};

/**
 * Creates a rich HTML element for the marker popup.
 * @param {EarthquakeFeature} eq - The earthquake feature data.
 * @returns {HTMLElement} The DOM element for the popup.
 */
const createPopup = (eq: EarthquakeFeature): HTMLElement => {
  const p = eq.properties;
  const [, , depth] = eq.geometry.coordinates;

  const el = L.DomUtil.create("div", "leaflet-popup-content-wrapper");
  el.innerHTML = `
    <div class="w-64 p-1 font-sans">
      <h3 class="text-base font-bold text-gray-800 mb-2 leading-tight">${p.title}</h3>
      <div class="space-y-1.5 text-sm">
        <div class="flex items-center">
          <strong class="w-20 text-gray-600 text-xs uppercase tracking-wider">Magnitude:</strong>
          <span class="font-bold text-lg" style="color: ${getColor(p.mag!)}">
            M ${magDisplay(p.mag)}
          </span>
          <span class="text-gray-500 text-xs ml-1.5">(${p.magType})</span>
        </div>
        <div class="flex items-center">
          <strong class="w-20 text-gray-600 text-xs uppercase tracking-wider">Depth:</strong>
          <span class="font-medium text-gray-800">${depth.toFixed(1)} km</span>
        </div>
        <div class="flex items-center">
          <strong class="w-20 text-gray-600 text-xs uppercase tracking-wider">Time:</strong>
          <span class="font-medium text-gray-800">${formatTime(p.time)}</span>
        </div>
        <div class="flex items-center">
          <strong class="w-20 text-gray-600 text-xs uppercase tracking-wider">Tsunami:</strong>
          <span class="font-semibold ${p.tsunami ? "text-red-600" : "text-green-600"}">
            ${p.tsunami ? "Warning" : "No Warning"}
          </span>
        </div>
      </div>
      <a
        href="${p.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="block mt-3 text-center text-xs text-blue-600 font-semibold py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        View on USGS →
      </a>
    </div>
  `;
  return el;
};

export default MapComponent;
