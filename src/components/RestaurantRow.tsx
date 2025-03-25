import { Restaurant } from '@/types/restaurants';
import React from 'react';
import Deal from './Deal';

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
          <div>
            <Label>Deals</Label>
            <ul className="space-y-2 mt-1">
              <Deal restaurantId={restaurant.id} />
            </ul>
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
          <ul className="space-y-2">
            <Deal restaurantId={restaurant.id} />
          </ul>
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

// Icons (You should import these from your actual icon library)
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default RestaurantRow;
