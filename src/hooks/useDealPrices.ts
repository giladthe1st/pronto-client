// src/hooks/useDealPrices.ts
import { useEffect, useState } from 'react';
import { Restaurant } from '@/types/restaurants';
import { DealData } from '@/types/deals';
import { fetchWithFallback } from '@/utils/api';

// Fetches the *minimum* deal price for a list of restaurants.
// WARNING: This fetches deals for ALL provided restaurants concurrently.
// This can be inefficient for large lists and might hit rate limits.
// Consider server-side sorting or fetching prices on demand if scalability becomes an issue.
export const useDealPrices = (restaurants: Restaurant[], enabled: boolean) => {
  const [dealPrices, setDealPrices] = useState<Record<number, number>>({}); // Map: restaurantId -> minPrice
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const restaurantIds = restaurants.map(r => r.id);
  const restaurantIdsString = JSON.stringify(restaurantIds);


  useEffect(() => {
    // Only run if enabled (e.g., when sortBy === 'price') and there are restaurants
    if (!enabled || restaurants.length === 0) {
      setDealPrices({}); // Clear prices if not enabled
      setLoading(false);
      setError(null);
      return;
    }

    const fetchAllDealPrices = async () => {
      setLoading(true);
      setError(null);
      const prices: Record<number, number> = {};
      const restaurantIds = restaurants.map(r => r.id);

      try {
        const results = await Promise.allSettled(
          restaurantIds.map(id =>
            fetchWithFallback(`/restaurants/${id}/deals`).then(res => {
              if (!res.ok) throw new Error(`Failed for ${id}: ${res.status}`);
              return res.json();
            })
          )
        );

        results.forEach((result, index) => {
          const restaurantId = restaurantIds[index];
          if (result.status === 'fulfilled') {
            const deals: DealData[] = result.value;
            if (deals.length > 0) {
              // Find the minimum price among the deals for this restaurant
              prices[restaurantId] = Math.min(...deals.map(d => d.price));
            } else {
               // Handle restaurants with no deals (assign Infinity for sorting)
               prices[restaurantId] = Infinity;
            }
          } else {
            // Handle failed fetches for individual restaurants
            console.warn(`Failed to fetch deals for restaurant ${restaurantId}:`, result.reason);
             prices[restaurantId] = Infinity; // Assign Infinity if fetch failed
          }
        });

        setDealPrices(prices);

      } catch (err) {
          // Catch potential errors from Promise.allSettled or initial setup (unlikely here)
          console.error("Error fetching deal prices:", err);
          setError(err instanceof Error ? err.message : "Failed to load some deal prices.");
          // Set all to Infinity on catastrophic failure? Or keep partial results?
          // Setting partial results might be better:
          // setDealPrices(prices); // Keep whatever was successful
      } finally {
        setLoading(false);
      }
    };

    fetchAllDealPrices();
    // Depend on `enabled` and the list of restaurant IDs (as a stable string)
  }, [enabled, restaurantIdsString, restaurants]);

  // loading/error state might be useful for the UI if price sorting is selected but still loading
  return { dealPrices, loading, error };
};