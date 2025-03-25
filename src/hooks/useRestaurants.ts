import { Restaurant } from '@/types/restaurants';
import { useState, useEffect } from 'react';


// Custom hook to fetch and provide restaurants data
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurants and categories in parallel
        const [restaurantsRes, categoriesRes] = await Promise.all([
          fetch('https://pronto-server.vercel.app/api/restaurants'),
          fetch('https://pronto-server.vercel.app/api/restaurantCategories')
        ]);

        const [restaurantsData, categoriesData] = await Promise.all([
          restaurantsRes.json(),
          categoriesRes.json()
        ]);

        // Create categories map
        const categoriesMap = new Map<number, string[]>();
        categoriesData.forEach(({ restaurant_id, category_name }: any) => {
          categoriesMap.set(restaurant_id, [
            ...(categoriesMap.get(restaurant_id) || []),
            category_name
          ]);
        });

        // Transform restaurant data
        const transformedData = restaurantsData.map((restaurant: Restaurant) => ({
          ...restaurant,
          categories: categoriesMap.get(restaurant.id) || [],
          menu: '',
          distance: 0
        }));

        setRestaurants(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  // Add error and loading states to hook return
return { restaurants, error };
}