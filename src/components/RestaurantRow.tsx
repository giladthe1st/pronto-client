import { Restaurant } from '@/types/restaurants';
import React, { useState as useStateReact } from 'react';
import DealsList from './DealsList';
import {
  StarIcon,
  DocumentTextIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const RestaurantRow: React.FC<Restaurant> = ( restaurant ) => {
  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden p-4 border rounded my-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{restaurant.name}</h2>
            <div className="flex items-center mt-1">
              <span className="font-medium">
                {restaurant.average_rating}
              </span>
              <StarIcon className="w-5 h-5 ml-1" />
              <span className="text-sm ml-2">
                ({restaurant.reviews_count})
              </span>
            </div>
          </div>
          <MapPinIcon className="w-6 h-6" />
        </div>

        <div className="space-y-4">
            <Label>Deals</Label>
            <div className="mt-1">
            <DealsList restaurantId={restaurant.id} />
          </div>
          <div>
            <Label>Menu</Label>
            <div className="mt-1 flex items-center">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              <a href="#" className="font-medium">View Menu</a>
            </div>
          </div>
          <div>
            <Label>Cuisine</Label>
            <div className="mt-1 flex items-center">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              <a href="#" className="font-medium">View Menu</a>
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <div className="mt-1 flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2" />
              <p>{restaurant.address}</p>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              {/* <span className="ml-6">{restaurant.distance.toFixed(1)} miles away</span> */}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:grid grid-cols-6 gap-6 p-4 items-center border rounded">
        <div className="font-bold text-lg">{restaurant.name}</div>

        <div>
          <DealsList restaurantId={restaurant.id} />
        </div>

        <div>
          <a href="#" className="inline-flex items-center font-medium">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            View Menu
          </a>
        </div>

        <div>
          <a href="#" className="inline-flex items-center font-medium">
            {restaurant.categories.join(', ')}
          </a>
        </div>

        <div className="flex items-center">
          <div className="flex items-center border px-3 py-1 rounded-full">
            <span className="font-medium mr-1">
              {restaurant.average_rating}
            </span>
            <StarIcon className="w-5 h-5" />
          </div>
          <span className="text-sm ml-2">
            ({restaurant.reviews_count})
          </span>
        </div>

        <div>
          <div className="flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            {/* <span className="ml-7">{restaurant.distance.toFixed(1)} miles away</span> */}
          </div>
        </div>
      </div>
    </>
  );
};

// Helper components
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-sm font-semibold uppercase tracking-wide">
    {children}
  </span>
);

// export default RestaurantRow;
// function useState(arg0: boolean): [any, any] {
//   throw new Error('Function not implemented.');
// }

export default RestaurantRow;