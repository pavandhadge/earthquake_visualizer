import { useEffect, useState } from "react";
import type { EarthquakeGeoJson } from "../EarthquakeTypes";

const useEarthQuakeData = (API_URL: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EarthquakeGeoJson | null>(null);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(API_URL);

        if (!resp.ok) {
          throw new Error("failed to fetch latest data");
        }
        const jsondata = await resp.json();
        if (jsondata) {
          console.log(jsondata);
        }
        setData(jsondata);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [API_URL]);

  return { data, loading, error };
};

export default useEarthQuakeData;
