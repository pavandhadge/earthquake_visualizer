import { useEffect, useState } from "react";
import type { EarthquakeGeoJson } from "../EarthquakeTypes";

/**
 * A custom React hook to fetch and manage earthquake data from a specified API URL.
 * @param {string} API_URL - The URL of the GeoJSON feed to fetch.
 * @returns An object containing the fetched data, loading state, and any potential error.
 */
const useEarthQuakeData = (API_URL: string) => {
  // State to track if the data is currently being fetched.
  const [loading, setLoading] = useState<boolean>(false);
  // State to store any error message that occurs during fetching.
  const [error, setError] = useState<string | null>(null);
  // State to hold the fetched and parsed GeoJSON data.
  const [data, setData] = useState<EarthquakeGeoJson | null>(null);

  useEffect(() => {
    /**
     * An async function to perform the data fetch operation.
     */
    const fetchdata = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(API_URL);

        if (!resp.ok) {
          throw new Error("Failed to fetch latest earthquake data.");
        }
        const jsondata: EarthquakeGeoJson = await resp.json();
        if (jsondata) {
          console.log("Successfully fetched earthquake data:", jsondata);
        }
        setData(jsondata);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching data.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Execute the fetch operation when the component mounts or the API_URL changes.
    fetchdata();
  }, [API_URL]); // Dependency array ensures this effect runs only when the URL changes.

  return { data, loading, error };
};

export default useEarthQuakeData;
