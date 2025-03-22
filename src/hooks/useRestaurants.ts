import { Restaurant } from '@/types/restaurants';
import { useState, useEffect } from 'react';


// Custom hook to fetch and provide restaurants data
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/restaurants');
        const data = await response.json();

        const transformedData = data.map((restaurant: Restaurant) => ({
          ...restaurant,
          // Add these if you want to keep them temporarily
          menu: '',         // Requires backend implementation
          distance: 0       // Requires backend implementation
        }));

        setRestaurants(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
      }
    };

    fetchData();
  }, []);

  // Add error and loading states to hook return
return { restaurants, error };
}