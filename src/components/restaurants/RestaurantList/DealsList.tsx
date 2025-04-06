// src/components/restaurants/RestaurantList/DealsList.tsx
import React from 'react';
import { DealData } from '@/types/deals'; // Use centralized type

interface DealsListProps {
  deals: DealData[];
  loading: boolean;
  error: string | null;
}

const DealsList: React.FC<DealsListProps> = ({ deals, loading, error }) => {

  if (loading) {
    // Improved Loading Skeleton
    return (
      <div className="space-y-4 p-1">
        {[...Array(2)].map((_, i) => ( // Skeleton for 2 deals
          <div key={i} className="border border-gray-100 rounded-xl p-5 bg-gray-50 animate-pulse">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                 <div className="flex items-center gap-2">
                     <div className="h-4 bg-gray-200 rounded w-16"></div>
                     <div className="h-4 bg-gray-200 rounded w-20"></div>
                 </div>
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                 <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="text-right min-w-[100px] space-y-2">
                <div className="h-7 bg-gray-300 rounded w-20 ml-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-16 ml-auto"></div>
                 <div className="h-9 bg-gray-300 rounded w-full mt-3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600 border border-red-200">
        ⚠️ Error loading deals: {error}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center border border-gray-200">
        No current deals available for this restaurant.
      </div>
    );
  }

  // Sort deals by price within this list (this is purely presentation logic now)
  const sortedDeals = [...deals].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="font-semibold text-gray-700">
          {sortedDeals.length} {sortedDeals.length !== 1 ? 'Available Deals' : 'Available Deal'}
        </div>
      </div>

      {/* Deals Grid/List */}
      {sortedDeals.map((deal) => (
        <div
          key={deal.id}
          className="border border-gray-200 rounded-xl p-4 md:p-5 transition-shadow duration-200 ease-in-out hover:shadow-md bg-white" // Subtle background change
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {/* Deal Details */}
            <div className="flex-1">
              <h3 className="font-semibold text-base md:text-lg text-gray-800 mb-1.5">{deal.summarized_deal}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {deal.details}
              </p>
            </div>

            {/* Price & Action */}
            <div className="text-right w-full sm:w-auto sm:min-w-[110px] flex-shrink-0 mt-3 sm:mt-0">
              <div className="text-xl md:text-2xl font-bold text-green-600">
                ${deal.price.toFixed(2)}
              </div>
              <button className="mt-3 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
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