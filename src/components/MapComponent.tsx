import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  LayersControl,
  GeoJSON,
} from "react-leaflet";
import type { EarthquakeFeature, EarthquakeGeoJson } from "../EarthquakeTypes";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TectonicPlates from "./TectonicPlates";

interface MapComponentProps {
  data: EarthquakeGeoJson;
  selectedQuakeId: string | null;
}

// Helper: magnitude → radius
const magToRadius = (mag: number | null): number => {
  if (mag === null) return 6;
  return Math.max(6, mag * 6);
};

// This component flies to the selected earthquake and opens the popup
const FlyToSelected = ({ selectedQuakeId, data }: MapComponentProps) => {
  const map = useMap();

  useEffect(() => {
    if (selectedQuakeId) {
      const feature = data.features.find((f) => f.id === selectedQuakeId);
      if (feature) {
        const [lng, lat] = feature.geometry.coordinates;
        map.flyTo([lat, lng], map.getZoom(), {
          duration: 1,
        });

        // Open popup after flying
        map.eachLayer((layer) => {
          if (layer instanceof L.CircleMarker) {
            // @ts-ignore
            if (layer.feature && layer.feature.id === selectedQuakeId) {
              layer.openPopup();
            }
          }
        });
      }
    }
  }, [selectedQuakeId, map, data]);

  return null;
};

export const MapComponent = ({ data, selectedQuakeId }: MapComponentProps) => {
  // Center on average of quakes
  const total = data.features.length;
  const centerLat =
    data.features.reduce((s, f) => s + f.geometry.coordinates[1], 0) / total;
  const centerLng =
    data.features.reduce((s, f) => s + f.geometry.coordinates[0], 0) / total;

  const mapCenter: [number, number] = [centerLat || 20, centerLng || 0];

  return (
    <MapContainer
      center={mapCenter}
      zoom={2}
      scrollWheelZoom
      style={{ height: "100vh", width: "100%" }}
      worldCopyJump={true}
      minZoom={2}
      maxZoom={10}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked name="Tectonic Plates">
          <>
            {[-360, 0, 360].map((offset) => (
              <TectonicPlates key={offset} offset={offset} />
            ))}
          </>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Earthquakes">
          <>
            {[-360, 0, 360].map((offset) =>
              data.features
                .filter((eq) => eq.properties.mag !== null)
                .map((eq: EarthquakeFeature) => {
                  const [lng, lat, depth] = eq.geometry.coordinates;
                  const {
                    mag,
                    time,
                    title,
                    url,
                    tsunami,
                    status,
                    magType,
                    sig,
                  } = eq.properties;
                  const isSelected = eq.id === selectedQuakeId;

                  return (
                    <CircleMarker
                      key={`${eq.id}-${offset}`}
                      center={[lat, lng + offset]}
                      // @ts-ignore
                      feature={eq} // Pass feature data to layer
                      radius={magToRadius(mag)}
                      pathOptions={{
                        fillColor:
                          mag! > 5
                            ? "#b30000"
                            : mag! > 3
                              ? "#ff8c00"
                              : "#33cc33",
                        fillOpacity: isSelected ? 0.9 : 0.7,
                        color: isSelected ? "#0000ff" : "#000",
                        weight: isSelected ? 3 : 1,
                      }}
                    >
                      <Popup>
                        <div style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                          <strong>{title}</strong>
                          <br />
                          <strong>Magnitude:</strong> {mag ?? "—"} ({magType})
                          <br />
                          <strong>Depth:</strong> {depth.toFixed(1)} km
                          <br />
                          <strong>Time:</strong>{" "}
                          {new Date(time).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                          <br />
                          <strong>Tsunami:</strong>{" "}
                          {tsunami === 1 ? "Yes" : "No"}
                          <br />
                          <strong>Status:</strong> {status}
                          <br />
                          <strong>Significance:</strong> {sig}
                          <br />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            USGS Detail
                          </a>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                }),
            )}
          </>
        </LayersControl.Overlay>
      </LayersControl>

      <FlyToSelected selectedQuakeId={selectedQuakeId} data={data} />
    </MapContainer>
  );
};

export default MapComponent;
