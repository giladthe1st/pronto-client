// hooks/useRestaurants.ts
import { Restaurant } from '@/types/restaurants';
import { useState, useEffect } from 'react';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error
      try {
        const [restaurantsRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:3001/api/restaurants').catch(() =>
            fetch('https://pronto-server.vercel.app/api/restaurants')
          ),
          fetch('http://localhost:3001/api/restaurantCategories').catch(() =>
            fetch('https://pronto-server.vercel.app/api/restaurantCategories')
          ),
        ]);

        // Check responses before parsing JSON
        if (!restaurantsRes.ok) throw new Error(`Failed to fetch restaurants: ${restaurantsRes.statusText}`);
        if (!categoriesRes.ok) throw new Error(`Failed to fetch categories: ${categoriesRes.statusText}`);

        const [restaurantsData, categoriesData] = await Promise.all([
          restaurantsRes.json(),
          categoriesRes.json()
        ]);

        const categoriesMap: Map<number, string[]> = new Map();
        categoriesData.forEach(({ restaurant_id, category_name }: { restaurant_id: number, category_name: string }) => {
          categoriesMap.set(restaurant_id, [
            ...(categoriesMap.get(restaurant_id) || []),
            category_name
          ]);
        });

        // Map API data to Restaurant type (WITHOUT distance initially)
        const transformedData = restaurantsData.map((r: any) => ({ // Use 'any' carefully or define an API specific type
          id: r.id,
          name: r.name,
          logo_url: r.logo_url,
          website_url: r.website_url,
          reviews_count: r.reviews_count,
          average_rating: r.average_rating,
          address: r.address,
          maps_url: r.maps_url,
          latitude: r.latitude,
          longitude: r.longitude,
          categories: categoriesMap.get(r.id) || [],
          // menu: '', // Only include if needed, API doesn't provide it
          // distance is intentionally omitted here, will be calculated later
        }));

        setRestaurants(transformedData);
      } catch (err) {
        console.error("Error fetching restaurant data:", err); // Log the actual error
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
         setLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchData();
  }, []);

  // Return loading state as well
  return { restaurants, error, loading };
}