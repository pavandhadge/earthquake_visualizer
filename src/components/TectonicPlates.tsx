import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import type { FeatureCollection } from "geojson";

const TECTONIC_PLATES_URL =
  "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

interface TectonicPlatesProps {
  offset?: number;
}

const transformCoordinates = (geometry: any, offset: number) => {
  switch (geometry.type) {
    case "LineString":
      return geometry.coordinates.map((point: number[]) => [
        point[0] + offset,
        point[1],
      ]);
    case "MultiLineString":
      return geometry.coordinates.map((line: number[][]) =>
        line.map((point: number[]) => [point[0] + offset, point[1]]),
      );
    default:
      return geometry.coordinates;
  }
};

const TectonicPlates = ({ offset = 0 }: TectonicPlatesProps) => {
  const [plates, setPlates] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    const fetchPlates = async () => {
      try {
        const response = await fetch(TECTONIC_PLATES_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch tectonic plates data");
        }
        const data = await response.json();
        setPlates(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlates();
  }, []);

  if (!plates) return null;

  const transformedPlates =
    offset !== 0
      ? {
          ...plates,
          features: plates.features.map((feature) => ({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: transformCoordinates(feature.geometry, offset),
            },
          })),
        }
      : plates;

  return (
    <GeoJSON
      data={transformedPlates}
      style={{
        color: "#ff7800",
        weight: 2,
      }}
    />
  );
};

export default TectonicPlates;
