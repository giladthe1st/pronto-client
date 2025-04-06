// src/hooks/useDeals.ts
import { useState, useEffect } from 'react';
import { DealData } from '@/types/deals';
import { fetchWithFallback } from '@/utils/api';

export function useDeals(restaurantId: number | null) {
  const [deals, setDeals] = useState<DealData[]>([]);
  const [loading, setLoading] = useState(false); // Start false, only load when ID is valid
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we have a valid restaurantId
    if (restaurantId === null) {
      setDeals([]); // Clear deals if no restaurant is selected
      setLoading(false);
      setError(null);
      return;
    }

    const fetchDealsForRestaurant = async () => {
      setLoading(true);
      setError(null);
      setDeals([]); // Clear previous deals

      try {
        const response = await fetchWithFallback(`/restaurants/${restaurantId}/deals`);

        if (!response.ok) {
          // Provide more specific error messages if possible
          if (response.status === 404) {
             throw new Error('Deals not found for this restaurant.');
          }
          throw new Error(`Failed to fetch deals: ${response.status} ${response.statusText}`);
        }

        const data: DealData[] = await response.json();
        setDeals(data);
      } catch (err) {
        console.error(`Error fetching deals for restaurant ${restaurantId}:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading deals.');
      } finally {
        setLoading(false);
      }
    };

    fetchDealsForRestaurant();
  }, [restaurantId]); // Re-fetch when restaurantId changes

  return { deals, loading, error };
}