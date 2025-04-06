// src/hooks/useRestaurants.ts
import { useState, useEffect } from 'react';
import { Restaurant, RestaurantApiResponse, CategoryApiResponse } from '@/types/restaurants';
import { fetchWithFallback } from '@/utils/api'; // Using the helper

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch restaurants and categories concurrently
        const [restaurantsRes, categoriesRes] = await Promise.all([
          fetchWithFallback('/restaurants'),
          fetchWithFallback('/restaurantCategories')
        ]);

        if (!restaurantsRes.ok) {
          throw new Error(`Failed to fetch restaurants: ${restaurantsRes.status} ${restaurantsRes.statusText}`);
        }
        if (!categoriesRes.ok) {
            // Decide if fetching categories is critical. Maybe proceed without them?
            console.warn(`Failed to fetch categories: ${categoriesRes.status} ${categoriesRes.statusText}. Proceeding without category data.`);
            // For simplicity here, we'll throw, but you might handle this differently.
           throw new Error(`Failed to fetch categories: ${categoriesRes.status} ${categoriesRes.statusText}`);
        }

        const restaurantsData: RestaurantApiResponse[] = await restaurantsRes.json();
        const categoriesData: CategoryApiResponse[] = await categoriesRes.json();

        // Process categories into a Map for efficient lookup
        const categoriesMap = new Map<number, string[]>();
        categoriesData.forEach(({ restaurant_id, category_name }) => {
          if (!categoriesMap.has(restaurant_id)) {
            categoriesMap.set(restaurant_id, []);
          }
          categoriesMap.get(restaurant_id)?.push(category_name);
        });

        // Map API data to the frontend Restaurant type
        const transformedData: Restaurant[] = restaurantsData.map((apiRestaurant) => ({
          id: apiRestaurant.id,
          name: apiRestaurant.name,
          logo_url: apiRestaurant.logo_url,
          website_url: apiRestaurant.website_url,
          reviews_count: apiRestaurant.reviews_count,
          average_rating: apiRestaurant.average_rating,
          address: apiRestaurant.address,
          maps_url: apiRestaurant.maps_url,
          latitude: apiRestaurant.latitude,
          longitude: apiRestaurant.longitude,
          categories: categoriesMap.get(apiRestaurant.id) || [],
          // distance is added later by useRestaurantFilters
        }));

        setRestaurants(transformedData);

      } catch (err) {
        console.error("Error fetching initial restaurant data:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch only on mount

  return { restaurants, error, loading };
}