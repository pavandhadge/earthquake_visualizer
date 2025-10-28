// EarthquakeTypes.ts
export interface EarthquakeProperties {
  mag: number | null;
  place: string | null;
  time: number;
  updated: number;
  tz: number | null;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst: number | null;
  dmin: number | null;
  rms: number;
  gap: number | null;
  magType: string;
  type: string;
  title: string;
}

export interface EarthquakeFeature {
  type: "Feature";
  properties: EarthquakeProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
  id: string;
}

export interface EarthquakeMetadata {
  generated: number;
  url: string;
  title: string;
  status: number;
  api: string;
  count: number;
}

export interface EarthquakeGeoJson {
  type: "FeatureCollection";
  metadata: EarthquakeMetadata;
  features: EarthquakeFeature[];
  bbox?: [number, number, number, number, number, number]; // [minLongitude, minLatitude, minDepth, maxLongitude, maxLatitude, maxDepth]
}
