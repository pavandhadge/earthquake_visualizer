import { useEffect, useState, useMemo } from "react";
import React from "react";
import { GeoJSON } from "react-leaflet";
import type { FeatureCollection } from "geojson";

const URL =
  "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

interface Props {
  offset: number;
}

/** Transform a single geometry – runs only when offset changes */
const transform = (geom: any, offset: number) => {
  if (!offset) return geom.coordinates;
  switch (geom.type) {
    case "LineString":
      return geom.coordinates.map(([x, y]: number[]) => [x + offset, y]);
    case "MultiLineString":
      return geom.coordinates.map((line: number[][]) =>
        line.map(([x, y]) => [x + offset, y]),
      );
    default:
      return geom.coordinates;
  }
};

const TectonicPlates = ({ offset }: Props) => {
  const [raw, setRaw] = useState<FeatureCollection | null>(null);

  // ---------- fetch once ----------
  useEffect(() => {
    let cancelled = false;
    fetch(URL)
      .then((r) => r.json())
      .then((d) => !cancelled && setRaw(d))
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- memoised transformed GeoJSON ----------
  const data = useMemo(() => {
    if (!raw) return null;
    if (!offset) return raw;

    return {
      ...raw,
      features: raw.features.map((f) => ({
        ...f,
        geometry: {
          ...f.geometry,
          coordinates: transform(f.geometry, offset),
        },
      })),
    };
  }, [raw, offset]);

  if (!data) return null;

  return (
    <GeoJSON
      key={offset} // forces Leaflet to reuse the layer when offset changes
      data={data}
      style={{ color: "#ff7800", weight: 2 }}
    />
  );
};

export default React.memo(TectonicPlates);
