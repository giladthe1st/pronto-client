import React, { useEffect, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/solid';

export interface DealData {
  id: number;
  created_at: string;
  details: string;
  restaurant_id: number;
  summarized_deal: string;
  price: number;
  restaurant_name: string;
}

interface DealsListProps {
  restaurantId: number;
}

const DealsList: React.FC<DealsListProps> = ({ restaurantId }) => {
  const [deals, setDeals] = useState<DealData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/restaurants/${restaurantId}/deals`
        ).catch(() =>
          fetch(`https://pronto-server.vercel.app/api/restaurants/${restaurantId}/deals`)
        );

        if (!response.ok) throw new Error('Failed to fetch deals');

        const data: DealData[] = await response.json();
        setDeals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [restaurantId]);

  const calculateSavings = (deal: DealData) => {
    const basePrice = deal.price * 1.3;
    return Math.round(((basePrice - deal.price) / basePrice) * 100);
  };

  if (loading) return (
    <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 rounded-lg text-red-500">
      ⚠️ Error loading deals
    </div>
  );

  if (deals.length === 0) return (
    <div className="p-4 bg-gray-50 rounded-lg text-gray-500">
      No current deals available
    </div>
  );

  const sortedDeals = [...deals].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700">
          {sortedDeals.length} {sortedDeals.length > 1 ? 'Available Deals' : 'Available Deal'}
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>Updated today</span>
        </div>
      </div>

      {sortedDeals.map((deal) => (
        <div
          key={deal.id}
          className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                  SAVE {calculateSavings(deal)}%
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                  POPULAR
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{deal.summarized_deal}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {deal.details}
              </p>
            </div>
            <div className="text-right min-w-[100px]">
              <div className="text-2xl font-bold text-green-600">
                ${deal.price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 line-through">
                ${(deal.price * 1.3).toFixed(2)}
              </div>
              <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                Get Deal
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DealsList;