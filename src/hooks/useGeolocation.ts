import { useState, useEffect } from "react";

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

interface UseGeolocationResult {
  location: GeoLocation;
  loading: boolean;
  error: string | null;
}

// Default fallback: Eindhoven city center
const DEFAULT_LOCATION: GeoLocation = {
  latitude: 51.4416,
  longitude: 5.4697,
};

export function useGeolocation(): UseGeolocationResult {
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { location, loading, error };
}
