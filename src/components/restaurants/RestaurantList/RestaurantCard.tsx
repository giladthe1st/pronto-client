import React from 'react';
import { Restaurant } from '@/types/restaurants';
import { StarIcon } from '@heroicons/react/24/outline';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex">
        <div className="w-24 h-24 bg-gray-300 flex-shrink-0"></div>

        <div className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
              <p className="text-sm text-gray-500">{restaurant.categories.join(', ')}</p>
            </div>
            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
              <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-xs font-medium">{restaurant.average_rating}</span>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">250m away</p>
            <p className="text-sm text-gray-700 mb-2">Special deal description goes here...</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">$14.99</span>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                See deals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;