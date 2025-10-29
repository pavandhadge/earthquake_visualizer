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

/** ---------- Helpers ---------- */
const magToRadius = (mag: number | null): number =>
  mag === null ? 6 : Math.max(4, mag * 2.5);

const getColor = (mag: number): string =>
  mag > 5 ? "#b30000" : mag > 3 ? "#ff8c00" : "#33cc33";

const formatTime = (ms: number): string =>
  new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const magDisplay = (m: number | null): string =>
  m === null ? "—" : m.toFixed(1);

/** ---------- Fly to Selected + Open Popup ---------- */
const FlyToSelected = ({ selectedId, data }: Props) => {
  const map = useMap();
  const layerRef = useRef<L.CircleMarker | null>(null);

  useMapEvents({
    layeradd(e) {
      const layer = e.layer as L.CircleMarker;
      if ((layer as any).feature?.id === selectedId) {
        layerRef.current = layer;
      }
    },
  });

  useMemo(() => {
    if (!selectedId) {
      layerRef.current?.closePopup();
      layerRef.current = null;
      return;
    }

    const feature = data.features.find((f) => f.id === selectedId);
    if (!feature) return;

    const [lng, lat] = feature.geometry.coordinates;
    map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
    layerRef.current?.openPopup();
  }, [selectedId, data, map]);

  return null;
};

/** ---------- Main Map Component ---------- */
export const MapComponent = ({ data, selectedId }: Props) => {
  // Center on average of earthquakes
  const center = useMemo(() => {
    const n = data.features.length;
    if (n === 0) return [20, 0] as [number, number];

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

  // Memoized markers: only recompute when data or selection changes
  const markers = useMemo(() => {
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
              key={eq.id}
              center={[lat, lng + offset]}
              radius={magToRadius(mag)}
              pathOptions={{
                fillColor: getColor(mag),
                fillOpacity: isSelected ? 0.95 : 0.7,
                color: isSelected ? "#0000ff" : "#000",
                weight: isSelected ? 3 : 1,
              }}
              eventHandlers={{
                add: (e) => {
                  const layer = e.target as L.CircleMarker;
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
      worldCopyJump
      minZoom={2}
      maxZoom={9}
    >
      {/* === Base Layers === */}
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

        <LayersControl.BaseLayer name="Ocean">
          <TileLayer
            attribution="Esri Ocean Basemap"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* === Earthquakes (Always Visible) === */}
      <>{markers}</>

      {/* === Fly-to & Popup Handler === */}
      <FlyToSelected selectedId={selectedId} data={data} />
    </MapContainer>
  );
};

/** ---------- Rich Popup for Students ---------- */
const createPopup = (eq: EarthquakeFeature): HTMLElement => {
  const p = eq.properties;
  const [lng, lat, depth] = eq.geometry.coordinates;

  const el = L.DomUtil.create(
    "div",
    "p-4 max-w-xs bg-white rounded-lg shadow-lg",
  );
  el.style.fontSize = "0.9rem";
  el.style.lineHeight = "1.5";

  el.innerHTML = `
    <div class="font-bold text-lg text-blue-900 mb-2">${p.title}</div>
    <div class="space-y-1 text-sm">
      <div>
        <strong>Magnitude:</strong>
        <span class="ml-1 font-bold text-orange-600">M${magDisplay(p.mag)}</span>
        <span class="text-gray-500">(${p.magType})</span>
      </div>
      <div><strong>Depth:</strong> <span class="text-teal-600 font-medium">${depth.toFixed(1)} km</span></div>
      <div><strong>Time:</strong> ${formatTime(p.time)}</div>
      <div>
        <strong>Tsunami:</strong>
        <span class="${p.tsunami ? "text-red-600 font-bold" : "text-green-600"}">
          ${p.tsunami ? "Yes" : "No"}
        </span>
      </div>
      <div><strong>Significance:</strong> ${p.sig}</div>
      <div><strong>Status:</strong> <span class="capitalize">${p.status}</span></div>
      <a
        href="${p.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="block mt-3 text-blue-600 underline text-xs hover:text-blue-800"
      >
        USGS Detail →
      </a>
    </div>
  `;

  return el;
};

export default MapComponent;
