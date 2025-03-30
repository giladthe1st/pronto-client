// DealsList.tsx
import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, StarIcon } from '@heroicons/react/24/solid';

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
  const [expanded, setExpanded] = useState(false);

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

  const toggleExpand = () => setExpanded(!expanded);
  const minPrice = deals.length > 0 ? Math.min(...deals.map(d => d.price)) : 0;
  const maxPrice = deals.length > 0 ? Math.max(...deals.map(d => d.price)) : 0;

  if (loading) return <li className="p-2 text-gray-500">Loading deals...</li>;
  if (error) return <li className="p-2 text-red-500">Error: {error}</li>;
  if (deals.length === 0) return <li className="p-2 text-gray-500">No deals available</li>;

  const sortedDeals = [...deals].sort((a, b) => a.price - b.price);

  return (
    <div className="w-full">
      <button
        onClick={toggleExpand}
        className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
              {deals.length} DEAL{deals.length > 1 ? 'S' : ''}
            </span>
            {deals.length > 0 && (
              <span className="text-sm font-medium text-gray-600">
                From ${minPrice} - ${maxPrice}
              </span>
            )}
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-gray-500 transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20 overflow-y-auto"
          onClick={toggleExpand}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                {deals[0]?.restaurant_name} Deals
              </h2>
              <button
                onClick={toggleExpand}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close deals"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4">
              {sortedDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{deal.summarized_deal}</h3>
                      <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
                        {deal.details}
                      </p>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <div className="text-lg font-bold text-green-600">
                        ${deal.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsList;