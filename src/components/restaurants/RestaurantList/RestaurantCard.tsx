// components/restaurants/RestaurantList/RestaurantCard.tsx
import React from 'react';
// Removed: import Image from 'next/image';
import { Restaurant } from '@/types/restaurants';
import { StarIcon, MapPinIcon, BoltIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid'; // Added BuildingStorefrontIcon
import { formatDistance } from '@/utils/geo';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const formattedRating = restaurant.average_rating ? restaurant.average_rating.toFixed(1) : 'N/A';
  const distanceText = formatDistance(restaurant.distance);

  // Removed: hasValidLogo check

  return (
    <div
      className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer h-full group"
      onClick={onClick}
      role="button"
      aria-label={`View deals for ${restaurant.name}`}
    >
      {/* --- Mock Image/Icon Section --- */}
      <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 relative flex items-center justify-center overflow-hidden"> {/* Centering container */}
        {/* Placeholder Icon */}
        <BuildingStorefrontIcon className="w-16 h-16 text-gray-500 opacity-70" />

        {/* --- Rating Badge (still overlays) --- */}
        <div className="absolute top-3 right-3 flex items-center bg-black bg-opacity-70 rounded-full px-3 py-1 text-white shadow-lg z-10">
          <StarIcon className="w-4 h-4 text-yellow-400 mr-1.5" />
          <span className="text-xs font-bold tracking-wide">{formattedRating}</span>
        </div>
      </div>

      {/* --- Content Section (remains the same) --- */}
      <div className="p-4 flex flex-col flex-1 justify-between">
         {/* Top Info */}
         <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1 leading-tight truncate" title={restaurant.name}>
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2 capitalize truncate" title={restaurant.categories.join(', ')}>
            {restaurant.categories.join(' • ')} {/* Use bullet separator */}
          </p>
           {/* Subtle "Deals Available" Tag */}
           <div className="mb-3">
             <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                <BoltIcon className="w-3 h-3 mr-1 -ml-0.5" />
                Deals Available
             </span>
           </div>
        </div>

        {/* Bottom Info & Action */}
        <div>
          {/* Distance Info */}
          {distanceText && (
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
              <span>{distanceText}</span>
            </div>
          )}

          {/* --- Action Button --- */}
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-200 ease-in-out shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
          >
            See Deals
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;