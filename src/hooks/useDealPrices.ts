import { useEffect, useState } from 'react';
import { Restaurant } from '@/types/restaurants';
import { DealData } from '@/components/restaurants/RestaurantList/DealsList';

export const useDealPrices = (restaurants: Restaurant[], sortBy: string) => {
  const [dealPrices, setDealPrices] = useState<Record<number, number>>({});

  useEffect(() => {
    if (restaurants.length === 0 || sortBy !== 'price') return;

    const fetchDealPrices = async () => {
      const prices: Record<number, number> = {};

      try {
        await Promise.all(
          restaurants.map(async (restaurant) => {
            const response = await fetch(
              `http://localhost:3001/api/restaurants/${restaurant.id}/deals`
            ).catch(() =>
              fetch(`https://pronto-server.vercel.app/api/restaurants/${restaurant.id}/deals`)
            );

            if (response.ok) {
              const deals: DealData[] = await response.json();
              if (deals.length > 0) {
                prices[restaurant.id] = Math.min(...deals.map(d => d.price));
              }
            }
          })
        );

        setDealPrices(prices);
      } catch (err) {
        console.error("Error fetching deal prices:", err);
      }
    };

    fetchDealPrices();
  }, [restaurants, sortBy]);

  return { dealPrices };
};