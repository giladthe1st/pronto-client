// Create this new file: hooks/useUserLocation.ts
import { useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null); // Clear any previous error
      setLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      let message = "An unknown error occurred.";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          message = "User denied the request for Geolocation.";
          break;
        case err.POSITION_UNAVAILABLE:
          message = "Location information is unavailable.";
          break;
        case err.TIMEOUT:
          message = "The request to get user location timed out.";
          break;
      }
      setError(message);
      setLocation(null); // Ensure location is null on error
      setLoading(false);
    };

    // Request location
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
       enableHighAccuracy: false, // Lower accuracy is often faster and sufficient
       timeout: 10000, // 10 seconds
       maximumAge: 600000 // Allow cached location up to 10 minutes old
    });

  }, []); // Run only once on mount

  return { location, error, loading };
}